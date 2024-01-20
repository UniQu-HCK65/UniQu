const client = require("../config/configMongo");
const { GraphQLError } = require("graphql");
const { ObjectId } = require("mongodb");

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
    followingId: ID!
    followerId: ID!
  }

  type Query {
    transactions: [Transaction]
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

  Mutation: {},
};

module.exports = {
  typeDefs,
  resolvers,
};
