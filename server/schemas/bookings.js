// const client = require("../config/configMongo");
// const { GraphQLError } = require("graphql");
// const { ObjectId } = require("mongodb");

// const { formatDate } = require("../helpers/dateFormat");

// const COLLECTION_NAME = "Follows";

// // your data.
// const typeDefs = `#graphql
//   # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

//   # This "Book" type defines the queryable fields for every book in our data source.
//   type Follow {
//     _id: ID
//     followingId: ID
//     followerId: ID
//     createdAt: String
//     updatedAt: String
//   }

//   input NewFollow {
//     followingId: ID!
//     followerId: ID!
//   }

//   # The "Query" type is special: it lists all of the available queries that
//   # clients can execute, along with the return type for each. In this
//   # case, the "books" query returns an array of zero or more Books (defined above).
//   type Query {
//     follows: [Follow]
//   }

//   type Mutation {
//   follow(newFollow:NewFollow) : Follow
//   }
// `;

// // Resolvers define how to fetch the types defined in your schema.
// // This resolver retrieves books from the "books" array above.
// const resolvers = {
//   Query: {
//     follows: async (parent, args, contextValue, info) => {
//       const { db, authentication } = contextValue;
//       const auth = await authentication();

//       const follows = await db.collection(COLLECTION_NAME).find().toArray();

//       return follows;
//     },
//   },

//   Mutation: {
//     follow: async (parent, args, contextValue, info) => {
//       try {
//         const { newFollow } = args;
//         const { db, authentication } = contextValue;

//         const auth = await authentication();

//         newFollow.followerId = auth._id;
//         if (!newFollow.followerId)
//           throw {
//             message: "Can't follow, you are not logged in",
//             code: "UNAUTHORIZED",
//             status: 401,
//           };

//         if (!newFollow.followingId)
//           throw {
//             message: "UserId is not given",
//             code: "BAD_REQUEST",
//             status: 400,
//           };

//         if (newFollow.followerId === newFollow.followingId)
//           throw {
//             message: "You can't follow yourself",
//             code: "FORBIDDEN",
//             status: 403,
//           };

//         console.log(newFollow.followerId, "FOLLOWER");
//         console.log(newFollow.followingId, "FOLLOWING");

//         const follows = await db.collection(COLLECTION_NAME);

//         const isFollowing = await follows
//           .aggregate([
//             {
//               $match: {
//                 followerId: new ObjectId(newFollow.followerId),
//                 followingId: new ObjectId(newFollow.followingId),
//               },
//             },
//           ])
//           .toArray();

//         console.log(isFollowing, "DISINI");

//         if (isFollowing.length > 0)
//           throw {
//             message: "You already followed this user",
//             code: "FORBIDDEN",
//             status: 403,
//           };

//         const insertFollow = await follows.insertOne({
//           ...newFollow,
//           followerId: new ObjectId(newFollow.followerId),
//           followingId: new ObjectId(newFollow.followingId),
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         });

//         const followToShow = {
//           followerId: new ObjectId(newFollow.followerId),
//           followingId: new ObjectId(newFollow.followingId),
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         };

//         // console.log(insertFollow, "FOLLOW SUCCESS");

//         return {
//           ...newFollow,
//           _id: insertFollow.insertedId,
//           followerId: followToShow.followerId,
//           followingId: followToShow.followingId,
//           createdAt: formatDate(followToShow.createdAt),
//           updatedAt: formatDate(followToShow.updatedAt),
//         };
//       } catch (error) {
//         console.log(error, "FOLLOW"); // errorHandler next up
//         throw new GraphQLError(error.message || "Internal Server Error", {
//           extensions: {
//             code: error.code || "INTERNAL_SERVER_ERROR",
//             http: { status: error.status || 500 },
//           },
//         });
//       }
//     },
//   },
// };

// module.exports = {
//   typeDefs,
//   resolvers,
// };
