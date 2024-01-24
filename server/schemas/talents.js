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
    role: String
    gender: String
    imgUrl: String
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
  BookingId: ID
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
  bookId: ID
  }

  input SearchTalent {
    name: String
    username: String
  }

  type TalentActiveBooking {
  _id: ID
  username: String
  talentActiveBooking: [Booking]
  }

  type Query {
    talents: [Talent]
    searchTalent(searchParam:SearchTalent): [Talent]
    getTalentsById(talentId:String): ProfileTalent
    whoAmITalent: ProfileTalent
    getTalentActiveBooking: TalentActiveBooking
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

    getTalentActiveBooking: async (parent, args, contextValue, info) => {
      try {
        const { db, authentication } = contextValue;
        const auth = await authentication();

        const role = auth.role;

        if (role !== "talent") {
          throw {
            message: "Forbidden, you are not a talent",
            code: "FORBIDDEN",
            status: 403,
          };
        }

        const talentId = auth._id;

        if (!talentId)
          throw {
            message: "User not found",
            code: "NOT_FOUND",
            status: 404,
          };

        const talents = await db.collection(COLLECTION_NAME);

        const talentWithBookings = await talents
          .aggregate([
            {
              $match: {
                _id: new ObjectId(auth._id),
              },
            },
            {
              $lookup: {
                from: "Bookings",
                localField: "_id",
                foreignField: "TalentId",
                as: "talentActiveBooking",
              },
            },
            {
              $unwind: {
                path: "$talentActiveBooking",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $match: {
                $or: [
                  { "talentActiveBooking.bookStatus": "requested" },
                  { "talentActiveBooking.bookStatus": "booked" },
                  { "talentActiveBooking.bookStatus": "started" },
                  { "talentActiveBooking.bookStatus": "in progress" },
                ],
              },
            },
            {
              $group: {
                _id: {
                  _id: "$_id",
                  name: "$name",
                  username: "$username",
                  email: "$email",
                  role: "$role",
                  gender: "$gender",
                  imgUrl: "$imgUrl",
                  tags: "$tags",
                  userLocations: "$userLocations",
                  createdAt: "$createdAt",
                  updatedAt: "$updatedAt",
                },
                talentActiveBooking: { $push: "$talentActiveBooking" },
              },
            },
          ])
          .toArray();
        // console.log(talentWithBookings);

        if (talentWithBookings.length < 1)
          throw {
            message: "No active booking found....., yet",
            code: "NOT_FOUND",
            status: 404,
          };

        return {
          _id: new ObjectId(talentWithBookings[0]._id._id),
          username: talentWithBookings[0]._id.username,
          talentActiveBooking: talentWithBookings[0].talentActiveBooking,
        };
      } catch (error) {
        console.log(error, "GET_USER_ACTIVE_BOOKING"); // errorHandler next up
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

    searchTalent: async (parent, args, contextValue, info) => {
      try {
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

        const { searchParam } = args;

        const query = [];

        if (searchParam.name) {
          query.push({ name: new RegExp(searchParam.name, "i") });
        }
        if (searchParam.username) {
          query.push({ username: new RegExp(searchParam.username, "i") });
        }

        if (query.length === 0)
          throw {
            message: "Search parameters are empty",
            code: "BAD_REQUEST",
            status: 400,
          };

        const talents = await db.collection(COLLECTION_NAME);
        const searchTalents = await talents
          .find({ $or: query })
          .project({ password: 0 })
          .toArray();

        if (searchTalents.length === 0) {
          return null;
        }

        return searchTalents;
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

        if (!auth._id)
          throw {
            message: "Can't add the review, you are not logged in",
            code: "UNAUTHORIZED",
            status: 401,
          };

        const talents = await db.collection(COLLECTION_NAME);

        const bookings = await db.collection("Bookings");

        const users = await db.collection("Users");

        const findUser = await users.findOne({
          _id: new ObjectId(auth._id),
        });

        const reviewerName = findUser.name;

        const findTalent = await talents.findOne({
          _id: new ObjectId(newReview.talentId),
        });

        if (!findTalent)
          throw {
            message: "Talent not found",
            code: "NOT_FOUND",
            status: 404,
          };

        const findBooking = await bookings.findOne({
          _id: new ObjectId(newReview.bookId),
        });

        if (!findBooking)
          throw {
            message:
              "Booking not found, please check your BookingId and try again",
            code: "NOT_FOUND",
            status: 404,
          };

        if (findBooking.bookStatus === "Reviewed") {
          throw {
            message: "Can't add review, the booking has been reviewed",
            code: "FORBIDDEN",
            status: 403,
          };
        }

        if (findBooking.TalentId.toString() !== newReview.talentId) {
          throw {
            message: "Forbidden, booking does not belong to the talent",
            code: "FORBIDDEN",
            status: 403,
          };
        }

        const reviewToPush = {
          message: newReview.message,
          reviewerName: reviewerName,
          rating: newReview.rating,
          BookingId: new ObjectId(newReview.bookId),
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
        // console.log(insertedReview, "AAAA");

        if (insertedReview.acknowledged === false) {
          throw {
            message: "Failed to add review, please try again",
            code: "BAD_REQUEST",
            status: 400,
          };
        }

        const updateBookingStatus = await bookings.updateOne(
          {
            _id: new ObjectId(newReview.bookId),
          },
          {
            $set: {
              bookStatus: "Reviewed",
              updatedAt: new Date(),
            },
          }
        );

        return {
          ...newReview,
          reviewerName: reviewerName,
          BookingId: new ObjectId(newReview.bookId),
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
