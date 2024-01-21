const client = require("../config/configMongo");
const { GraphQLError } = require("graphql");
const { ObjectId } = require("mongodb");
const midtransClient = require("midtrans-client");

const { formatDate } = require("../helpers/dateFormat");

const COLLECTION_NAME = "Transactions";

// your data.
const typeDefs = `#graphql

  type Transaction {
    _id: ID
    TalentId: ID
    UserId: ID
    talentName: String
    userName: String
    paymentId: String
    BookingId: ID
    transactionStatus: String
    paidByAdmin: Boolean
    updatedAt: String
    createdAt: String

  }

  input NewTransaction {
    TalentId: ID
    UserId: ID
    talentName: String
    userName: String
    BookingId: ID
  }

  type Query {
    transactions: [Transaction]
  }

  type Mutation {
  initPayment(newTransaction:NewTransaction): User
  }

`;

const resolvers = {
  Query: {
    transactions: async (parent, args, contextValue, info) => {
      try {
        const { db, authentication } = contextValue;
        const auth = await authentication();

        const transactions = await db
          .collection(COLLECTION_NAME)
          .find()
          .toArray();
        return transactions;
      } catch (error) {
        console.log(error, "GET_TRANSACTIONS"); // errorHandler next up
        throw new GraphQLError(error.message || "Internal Server Error", {
          extensions: {
            code: error.code || "INTERNAL_SERVER_ERROR",
            http: { status: error.status || 500 },
          },
        });
      }
    },
  },

  Mutation: {
    initPayment: async (parent, args, contextValue, info) => {
      try {
        //OLEH TALENT
        const { newTransaction } = args;

        let snap = new midtransClient.Snap({
          isProduction: false,
          serverKey: process.env.MIDTRANS_SERVER_KEY,
        });

        const orderId = `TRX-BKNG-${
          newTransaction.BookingId
        }-${Math.random().toString()}-${auth._id}`;

        const trxAmount = 500_000;

        const transaction = await snap.createTransaction({
          transaction_details: {
            order_id: orderId,
            gross_amount: amount,
          },
          customer_details: {
            email: user.email,
          },
        });

        
      } catch (error) {
        console.log(error, "INIT_PAYMENT"); // errorHandler next up
        throw new GraphQLError(error.message || "Internal Server Error", {
          extensions: {
            code: error.code || "INTERNAL_SERVER_ERROR",
            http: { status: error.status || 500 },
          },
        });
      }
    },
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
