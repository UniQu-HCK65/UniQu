const client = require("../config/configMongo");
const { GraphQLError } = require("graphql");
const { ObjectId } = require("mongodb");
const midtransClient = require("midtrans-client");
const axios = require("axios");

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
    orderId: String
    paymentLink: String
    BookingId: ID
    transactionStatus: String
    paidByAdmin: Boolean
    updatedAt: String
    createdAt: String

  }

  input NewTransaction {
    BookingId: ID
  }

  type Query {
    transactions: [Transaction]
  }

  type Mutation {
  initPayment(newTransaction:NewTransaction): Transaction
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
        const { db, authentication } = contextValue;
        const auth = await authentication();

        // console.log(newTransaction.BookingId, "newTransaction");

        const talentId = auth._id;

        const transaction = await db.collection(COLLECTION_NAME);

        const findBooking = await db.collection("Bookings").findOne({
          _id: new ObjectId(newTransaction.BookingId),
        });

        // console.log(findBooking);

        const findTalent = await db.collection("Talents").findOne({
          _id: new ObjectId(talentId),
        });

        let snap = new midtransClient.Snap({
          isProduction: false,
          serverKey: process.env.MIDTRANS_SERVER_KEY,
        });

        const currentDate = new Date();

        const options = {
          year: "2-digit",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        };

        const formattedDate = currentDate.toLocaleDateString("id-Id", options);

        const twoDigitRandom = Math.floor(Math.random() * 90) + 10;

        // const orderId = `TRX-BKNG-${Math.random().toString()}`;
        // const orderId = `TRX-BKNG-1`;
        const orderId = `TRX-BKNG-${newTransaction.BookingId}-${auth.username}-${twoDigitRandom}`;

        const trxAmount = 500_000;

        const midtransTransaction = await snap.createTransaction({
          transaction_details: {
            order_id: orderId,
            gross_amount: trxAmount,
          },
          item_details: [
            {
              id: newTransaction.BookingId,
              price: 500000,
              quantity: 1,
              name: "Booking Session with " + findTalent.name,
            },
          ],
          customer_details: {
            first_name: findTalent.name,
            email: findTalent.email,
          },
        });

        console.log(midtransTransaction, "AAAAAAA");

        console.log(orderId, "orderId");


        // const midtransStatusUrl = `https://api.sandbox.midtrans.com/v2/TRX-BKNG-65acbf9036a6e5332ef534ab-JinYoung-92/status`;
        // // const midtransStatusUrl = `https://api.sandbox.midtrans.com/v2/${orderId}/status`;
        // console.log(midtransStatusUrl, "midtransStatusUrl");

        // const midtransOptions = {
        //   method: "GET",
        //   headers: {
        //     accept: "application/json",
        //     Authorization: `Basic ${Buffer.from(
        //       `${process.env.MIDTRANS_SERVER_KEY}:`
        //     ).toString("base64")}`,
        //   },
        // };

        // const midtransResponse = await axios.get(
        //   midtransStatusUrl,
        //   midtransOptions
        // );
        // const midtransData = midtransResponse.data;

        // console.log(midtransData, "BBBBBB");

        const createTransaction = await transaction.insertOne({
          ...newTransaction,
          TalentId: new ObjectId(talentId),
          UserId: new ObjectId(findBooking.UserId),
          BookingId: new ObjectId(newTransaction.BookingId),
          talentName: findBooking.talentName,
          userName: findBooking.userName,
          paymentId: midtransTransaction.token,
          orderId: orderId,
          paymentLink: midtransTransaction.redirect_url,
          transactionStatus: "unpaid",
          paidByAdmin: false,
          updatedAt: new Date(),
          createdAt: new Date(),
        });

        const findCreatedTransaction = await transaction.findOne({
          _id: new ObjectId(createTransaction.insertedId),
        });

        return findCreatedTransaction;
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
