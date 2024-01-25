const client = require("../config/configMongo");
const { GraphQLError } = require("graphql");
const { ObjectId } = require("mongodb");

const { formatDate } = require("../helpers/dateFormat");

const COLLECTION_NAME = "BankDetails";

// your data.
const typeDefs = `#graphql

  type BankDetails {
    _id: ID
    TalentId: ID
    bankName: String
    accountName: String
    accountNumber: String
    updatedAt: String
    createdAt: String
  }

  type Query {
    bankDetails: [BankDetails]
  }
`;
//WHY

const resolvers = {
  Query: {
    bankDetails: async (parent, args, contextValue, info) => {
      try {
        const { db, authentication } = contextValue;
        const auth = await authentication();
        const banks = await db.collection(COLLECTION_NAME).find().toArray();
        return banks;
      } catch (error) {
        console.log(error, "GET_BANKS"); // errorHandler next up
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