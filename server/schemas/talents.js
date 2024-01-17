const { ObjectId } = require("mongodb");
const { GraphQLError } = require("graphql");

const COLLECTION_NAME = "Talents";

const typeDefs = `#graphql

  type Talent {
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
    updatedAt: String
    createdAt: String
  }

  type Review {
  reviewerName: String
  message: String
  rating: Float
  updatedAt: String
  createdAt: String
  }

  input NewReview {
  talentId: ID
  reviewerName: String
  message: String
  rating: Float
  }

  type Query {
    talents: [Talent]
    getTalentsById(talentId:String): Talent
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

        // console.log(auth, "DARI POSTS"); //OBJ

        // console.log(parent, "PARENT");
        // console.log(args, "ARGS");
        // console.log(contextValue, "CTXVALUE");
        // console.log(info, "INFO");

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

        const findTalent = await talents.findOne({
          _id: new ObjectId(talentId),
        });

        if (!findTalent)
          throw {
            message: "Talent not found",
            code: "NOT_FOUND",
            status: 404,
          };

        return findTalent;
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

        newReview.reviewerName = auth.username;

        if (!newReview.reviewerName)
          throw {
            message: "Can't comment, you are not logged in",
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
          username: newReview.username,
          rating: newReview.rating,
          updatedAt: new Date(),
          createdAt: new Date(),
        };

        // console.log(commentToPush);

        const insertedReview = await talents.updateOne(
          {
            _id: new ObjectId(newReview.talentId),
          },
          {
            $push: {
              reviews: reviewToPush,
            },
          }
        );

        return {
          ...newReview,
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
