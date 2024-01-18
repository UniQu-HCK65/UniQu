const client = require("../config/configMongo");
const { GraphQLError } = require("graphql");
const { ObjectId } = require("mongodb");

const { formatDate } = require("../helpers/dateFormat");

const COLLECTION_NAME = "Bookings";

// your data.
const typeDefs = `#graphql

  type Booking {
    _id: ID
    TalentId: ID
    UserId: ID
    talentName: String
    userName: String
    TransactionId: ID
    bookDate: String
    bookLocation: String
    bookStatus: String
    updatedAt: String
    createdAt: String
  }

  input NewBooking {
    TalentId: ID
    TransactionId: ID
    bookDate: String
    bookLocation: String
  }

  type Query {
    bookings: [Booking]
  }

  type Mutation {
  book(newBooking:NewBooking) : Booking
  }
`;

const resolvers = {
  Query: {
    bookings: async (parent, args, contextValue, info) => {
      try {
        const { db, authentication } = contextValue;
        const auth = await authentication();
        const bookings = await db.collection(COLLECTION_NAME).find().toArray();
        return bookings;
      } catch (error) {
        console.log(error, "GET_BOOKINGS"); // errorHandler next up
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
    book: async (parent, args, contextValue, info) => {
      //BELOM JALAN OK, FLOW
      try {
        const { newBooking } = args;
        const { db, authentication } = contextValue;

        const auth = await authentication();

        return {
          _id: new ObjectId("1"),
          TalentId: new ObjectId("1"),
          UserId: new ObjectId(auth._id),
          TransactionId: new ObjectId("a"),
          bookDate: new Date(),
          bookLocation: "String",
          bookStatus: "String",
          updatedAt: new Date(),
          createdAt: new Date(),
        };
      } catch (error) {
        console.log(error, "FOLLOW"); // errorHandler next up
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
