// const { ObjectId } = require("mongodb");
// const client = require("../config/configMongo");
// const { GraphQLError } = require("graphql");
// const { formatDate } = require("../helpers/dateFormat");

// const COLLECTION_NAME = "Transactions";

// const typeDefs = `#graphql

//   type Comments {
//     content: String!
//     username: String!
//     createdAt: String
//     updatedAt: String
//   }

//   input NewComment {
//     postId: String!
//     content: String!
//     username: String!
//   }

//   type Likes {
//     username: String!
//     createdAt: String
//     updatedAt: String
//   }

//   input NewLike {
//     postId: String!
//     username: String!
//   }

//   type Post {
//     _id: ID!
//     content: String!
//     tags: [String]
//     imgUrl: String
//     authorId: ID!,
//     comments: [Comments]
//     likes: [Likes]
//     updatedAt: String
//     createdAt: String
//   }

//   input NewPost {
//     content: String!
//     tags: [String]
//     imgUrl: String
//   }

//   type Query {
//     posts: [Post]
//     getPostById(postId:ID): Post
//   }

//   type Mutation {
//     addPost(newPost:NewPost): Post
//     addComment(newComment:NewComment): Comments
//     addLike(newLike:NewLike): Likes
//   }
// `;

// const resolvers = {
//   Query: {
//     posts: async (parent, args, contextValue, info) => {
//       try {
//         const { db, authentication } = contextValue;
//         const auth = await authentication();

//         // console.log(auth, "DARI POSTS"); //OBJ

//         // console.log(parent, "PARENT");
//         // console.log(args, "ARGS");
//         // console.log(contextValue, "CTXVALUE");
//         // console.log(info, "INFO");

//         // const posts = await db.collection(COLLECTION_NAME).find().toArray();
//         const posts = await db
//           .collection(COLLECTION_NAME)
//           .aggregate([
//             {
//               $sort: {
//                 createdAt: -1,
//               },
//             },
//           ])
//           .toArray();

//         // console.log(posts, "INI KENAPA??")
//         const getRedis = await redis.get("app:posts");
//         // console.log(getRedis);

//         if (!getRedis) {
//           console.log("FROM MONGODB");
//           await redis.set("app:posts", JSON.stringify(posts));
//         } else {
//           console.log("FROM REDIS");
//           return JSON.parse(getRedis);
//         }

//         return posts;
//       } catch (error) {
//         console.log(error, "GET_POSTS"); // errorHandler next up
//         throw new GraphQLError(error.message || "Internal Server Error", {
//           extensions: {
//             code: error.code || "INTERNAL_SERVER_ERROR",
//             http: { status: error.status || 500 },
//           },
//         });
//       }
//     },

//     getPostById: async (parent, args, contextValue, info) => {
//       try {
//         const { db, authentication } = contextValue;
//         const auth = await authentication();

//         const { postId } = args;

//         const posts = await db.collection(COLLECTION_NAME);

//         const findPost = await posts.findOne({ _id: new ObjectId(postId) });

//         if (!findPost)
//           throw {
//             message: "Post not found",
//             code: "NOT_FOUND",
//             status: 404,
//           };

//         return findPost;
//       } catch (error) {
//         console.log(error, "GET_POST_BY_ID"); // errorHandler next up
//         throw new GraphQLError(error.message || "Internal Server Error", {
//           extensions: {
//             code: error.code || "INTERNAL_SERVER_ERROR",
//             http: { status: error.status || 500 },
//           },
//         });
//       }
//     },
//   },

//   Mutation: {
//     addPost: async (parent, args, contextValue, info) => {
//       try {
//         const { db, authentication } = contextValue;
//         const auth = await authentication();
//         const { newPost } = args;

//         if (!newPost.content)
//           throw {
//             message: "Content is required",
//             code: "BAD_REQUEST",
//             status: 400,
//           };

//         const posts = await db.collection(COLLECTION_NAME);

//         const addedPost = await posts.insertOne({
//           ...newPost,
//           authorId: new ObjectId(auth._id),
//           createdAt: new Date(),
//           updatedAt: new Date(),
//           comments: [],
//           likes: [],
//         });

//         await redis.del("app:posts");

//         const findAddedPost = await posts.findOne({
//           _id: addedPost.insertedId,
//         });
//         // console.log(findAddedPost);

//         return {
//           ...newPost,
//           authorId: auth._id,
//           _id: addedPost.insertedId,
//           comments: findAddedPost.comments,
//           likes: findAddedPost.likes,
//           createdAt: formatDate(findAddedPost.createdAt),
//           updatedAt: formatDate(findAddedPost.updatedAt),
//         };
//       } catch (error) {
//         console.log(error, "ADD_POST"); // errorHandler next up
//         throw new GraphQLError(error.message || "Internal Server Error", {
//           extensions: {
//             code: error.code || "INTERNAL_SERVER_ERROR",
//             http: { status: error.status || 500 },
//           },
//         });
//       }
//     },

//     addComment: async (parent, args, contextValue, info) => {
//       try {
//         const { newComment } = args;
//         const { db, authentication } = contextValue;

//         const auth = await authentication();

//         if (!newComment.content)
//           throw {
//             message: "Comment is required",
//             code: "BAD_REQUEST",
//             status: 400,
//           };

//         newComment.username = auth.username;
//         if (!newComment.username)
//           throw {
//             message: "Can't comment, you are not logged in",
//             code: "UNAUTHORIZED",
//             status: 401,
//           };

//         const posts = await db.collection(COLLECTION_NAME);

//         const findPost = await posts.findOne({
//           _id: new ObjectId(newComment.postId),
//         });

//         if (!findPost)
//           throw {
//             message: "Post not found",
//             code: "NOT_FOUND",
//             status: 404,
//           };

//         // console.log(findPost.comments, "OMILORD");

//         // console.log(newComment.corentent);
//         // console.log(newComment.username);

//         const commentToPush = {
//           content: newComment.content,
//           username: newComment.username,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         };

//         // console.log(commentToPush);

//         const insertedComment = await posts.updateOne(
//           {
//             _id: new ObjectId(newComment.postId),
//           },
//           {
//             $push: {
//               comments: commentToPush,
//             },
//           }
//         );

//         await redis.del("app:posts");

//         return {
//           ...newComment,
//           createdAt: formatDate(commentToPush.createdAt),
//           updatedAt: formatDate(commentToPush.updatedAt),
//         };
//       } catch (error) {
//         console.log(error, "ADD_COMMENT"); // errorHandler next up
//         throw new GraphQLError(error.message || "Internal Server Error", {
//           extensions: {
//             code: error.code || "INTERNAL_SERVER_ERROR",
//             http: { status: error.status || 500 },
//           },
//         });
//       }
//     },

//     addLike: async (parent, args, contextValue, info) => {
//       try {
//         const { newLike } = args;
//         const { db, authentication } = contextValue;

//         const auth = await authentication();

//         newLike.username = auth.username;
//         if (!newLike.username)
//           throw {
//             message: "Can't like, you are not logged in",
//             code: "UNAUTHORIZED",
//             status: 401,
//           };

//         const posts = await db.collection(COLLECTION_NAME);

//         const findPost = await posts.findOne({
//           _id: new ObjectId(newLike.postId),
//         });

//         if (!findPost)
//           throw {
//             message: "Post not found",
//             code: "NOT_FOUND",
//             status: 404,
//           };

//         const alreadyLiked =
//           findPost.likes.filter((like) => like.username === newLike.username)
//             .length > 0;

//         if (alreadyLiked)
//           throw {
//             message: "You've already liked the post",
//             code: "FORBIDDEN",
//             status: 403,
//           };

//         // console.log(alreadyLiked);

//         const likeToPush = {
//           username: newLike.username,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         };

//         // console.log(likeToPush);

//         const insertedLike = await posts.updateOne(
//           {
//             _id: new ObjectId(newLike.postId),
//           },
//           {
//             $addToSet: {
//               likes: likeToPush,
//             },
//           }
//         );

//         await redis.del("app:posts");

//         return {
//           ...newLike,
//           createdAt: formatDate(likeToPush.createdAt),
//           updatedAt: formatDate(likeToPush.updatedAt),
//         };
//       } catch (error) {
//         console.log(error, "ADD_LIKE"); // errorHandler next up
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
