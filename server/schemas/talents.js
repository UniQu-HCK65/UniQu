const { ObjectId } = require("mongodb");
const { GraphQLError } = require("graphql");

const COLLECTION_NAME = "Talents";

const typeDefs = `#graphql

  type Talent {
    _id: ID!
    name: String!
    username: String!
    email: String!
    password: String
    aboutme: String!
    role: String!
    gender: String
    imgUrl: String
    tags: [String]
    reviews: [Review]
    rating: Float
    talentLocations: [String]
    balance: Int
    updatedAt: String
    createdAt: String
  }

  type ProfileTalent {
    _id: ID
    name: String
    username: String
    email: String
    password: String
    aboutme: String
    gender: String
    tags: [String]
    reviews: [Review]
    rating: Float
    talentLocations: [String]
    balance: Int
    talentBookings: [Booking]
    talentTransactions: [Transaction]
    talentBankAccount: [BankDetails]
    updatedAt: String
    createdAt: String
  }

  type Review {
  message: String
  reviewerName: String
  rating: Float
  updatedAt: String
  createdAt: String
  }

  input NewReview {
  talentId: ID
  message: String
  rating: Float
  }

  type Query {
    talents: [Talent]
    getTalentsById(talentId:String): ProfileTalent
    whoAmITalent: ProfileTalent
  }

  type Mutation {
    addReview(newReview:NewReview): Review
  }
`;

const resolvers = {
  Query: {
    talents: async (parent, args, contextValue, info) => {
      try {
        const { db, authentication } = contextValue;
        const auth = await authentication();

        const talents = await db
          .collection(COLLECTION_NAME)
          .aggregate([
            {
              $sort: {
                createdAt: -1,
              },
            },
          ])
          .toArray();

        return talents;
      } catch (error) {
        console.log(error, "GET_TALENTS"); // errorHandler next up
        throw new GraphQLError(error.message || "Internal Server Error", {
          extensions: {
            code: error.code || "INTERNAL_SERVER_ERROR",
            http: { status: error.status || 500 },
          },
        });
      }
    },

    getTalentsById: async (parent, args, contextValue, info) => {
      try {
        const { db, authentication } = contextValue;
        const auth = await authentication();

        const { talentId } = args;

        const talents = await db.collection(COLLECTION_NAME);

        const findTalent = await talents
          .aggregate([
            {
              $match: {
                _id: new ObjectId(talentId),
              },
            },
            {
              $lookup: {
                from: "Bookings",
                localField: "_id",
                foreignField: "TalentId",
                as: "talentBookings",
              },
            },
            {
              $lookup: {
                from: "Transactions",
                localField: "_id",
                foreignField: "TalentId",
                as: "talentTransactions",
              },
            },
            {
              $lookup: {
                from: "BankDetails",
                localField: "_id",
                foreignField: "TalentId",
                as: "talentBankAccount",
              },
            },
          ])
          .toArray();

        if (!findTalent[0])
          throw {
            message: "Talent not found",
            code: "NOT_FOUND",
            status: 404,
          };

        return findTalent[0];
      } catch (error) {
        console.log(error, "GET_POST_BY_ID"); // errorHandler next up
        throw new GraphQLError(error.message || "Internal Server Error", {
          extensions: {
            code: error.code || "INTERNAL_SERVER_ERROR",
            http: { status: error.status || 500 },
          },
        });
      }
    },

    whoAmITalent: async (parent, args, contextValue, info) => {
      try {
        const { db, authentication } = contextValue;
        const auth = await authentication();

        const role = auth.role;

        if (role !== "talent") {
          throw {
            message: "Forbidden, you are not a talent",
            code: "NOT_FOUND",
            status: 403,
          };
        }

        const talentId = auth._id;

        const talents = await db.collection(COLLECTION_NAME);

        const findTalent = await talents
          .aggregate([
            {
              $match: {
                _id: new ObjectId(talentId),
              },
            },
            {
              $lookup: {
                from: "Bookings",
                localField: "_id",
                foreignField: "TalentId",
                as: "talentBookings",
              },
            },
            {
              $lookup: {
                from: "Transactions",
                localField: "_id",
                foreignField: "TalentId",
                as: "talentTransactions",
              },
            },
          ])
          .toArray();

        if (!findTalent[0])
          throw {
            message: "Talent not found",
            code: "NOT_FOUND",
            status: 404,
          };

        return findTalent[0];
      } catch (error) {
        console.log(error, "GET_POST_BY_ID"); // errorHandler next up
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
    addReview: async (parent, args, contextValue, info) => {
      try {
        const { newReview } = args;
        const { db, authentication } = contextValue;

        const auth = await authentication();

        const role = auth.role;

        if (role !== "user") {
          throw {
            message: "Forbidden, you are not a user",
            code: "NOT_FOUND",
            status: 403,
          };
        }

        const reviewerName = auth.username;

        if (!reviewerName)
          throw {
            message: "Can't add the review, you are not logged in",
            code: "UNAUTHORIZED",
            status: 401,
          };

        const talents = await db.collection(COLLECTION_NAME);

        const findTalent = await talents.findOne({
          _id: new ObjectId(newReview.talentId),
        });

        if (!findTalent)
          throw {
            message: "Talent not found",
            code: "NOT_FOUND",
            status: 404,
          };

        const reviewToPush = {
          message: newReview.content,
          reviewerName: reviewerName,
          rating: newReview.rating,
          updatedAt: new Date(),
          createdAt: new Date(),
        };

        const insertedReview = await talents.updateOne(
          {
            _id: new ObjectId(newReview.talentId),
          },
          {
            $push: {
              reviews: reviewToPush,
            },
            $inc: {
              rating: newReview.rating,
            },
          }
        );

        return {
          ...newReview,
          reviewerName: reviewerName,
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        };
      } catch (error) {
        console.log(error, "ADD_COMMENT"); // errorHandler next up
        throw new GraphQLError(error.message || "Internal Server Error", {
          extensions: {
            code: error.code || "INTERNAL_SERVER_ERROR",
            http: { status: error.status || 500 },
          },
        });
      }
    },

    ///////
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
