const { ObjectId } = require("mongodb");
const client = require("../config/configMongo");
const { hashPw, comparePwDecrypted } = require("../helpers/bcrypt");
const { validateEmail } = require("../helpers/isEmailregex");
const { GraphQLError } = require("graphql");
const { signToken } = require("../helpers/jwt");
const COLLECTION_NAME = "Users";

const typeDefs = `#graphql
  type User {
    _id: ID
    name: String
    username: String!
    email: String!
    password: String,
    role:String!,
    gender: String,
    tags: [String],
    userLocations: [String]
    createdAt: String
    updatedAt: String
  }

  input NewUser {
    name: String
    username: String!
    email: String!
    password: String!
    gender: String,
    tags: [String],
    userLocations: [String]
  }

  type ProfileUser {
    _id: ID
    name: String
    username: String!
    email: String!
    password: String
    followingName: [User]
    followersName: [User]
  }

  type TalentForMe {
    _id: ID
    username: String
    talentsForMe:[Talent]
  }

  type Query {
    users: [User]
    talentsForMe: TalentForMe
    userById(userId:ID): [ProfileUser]
    whoAmI: User
  }

  type Token {
    access_token: String
  }

  type Mutation {
  register(newUser:NewUser): User
  login(email:String, password:String): Token
  }
`;

const resolvers = {
  Query: {
    users: async (parent, args, contextValue, info) => {
      //   const db = client.db(process.env.DB_NAME);

      const { db, authentication } = contextValue;
      const auth = await authentication();

      const users = await db.collection(COLLECTION_NAME);

      const aggregatedUsers = await users
        .aggregate([
          {
            $project: {
              password: 0,
            },
          },
        ])
        .toArray();

      return aggregatedUsers;

      // return users;
    },
    userById: async (parent, args, contextValue, info) => {
      try {
        const { userId } = args;

        if (!userId)
          throw {
            message: "User not found",
            code: "NOT_FOUND",
            status: 404,
          };

        const { db, authentication } = contextValue;
        const auth = await authentication();

        const users = await db.collection(COLLECTION_NAME);

        const user = await users
          .aggregate([
            {
              $match: {
                _id: new ObjectId(userId),
              },
            },
            {
              $lookup: {
                from: "Follows",
                localField: "_id",
                foreignField: "followerId",
                as: "followingColl",
              },
            },
            {
              $lookup: {
                from: "Users",
                localField: "followingColl.followingId",
                foreignField: "_id",
                as: "followingName",
              },
            },
            {
              $lookup: {
                from: "Follows",
                localField: "_id",
                foreignField: "followingId",
                as: "followersColl",
              },
            },
            {
              $lookup: {
                from: "Users",
                localField: "followersColl.followerId",
                foreignField: "_id",
                as: "followersName",
              },
            },
            {
              $project: {
                "followersName.password": 0,
                "followingName.password": 0,
                password: 0,
              },
            },
          ])
          .toArray();
        // console.log(user);

        if (user.length < 1)
          throw {
            message: "User not found",
            code: "NOT_FOUND",
            status: 404,
          };

        // console.log(user,"AGGREGATE CUY");

        return user;
      } catch (error) {
        console.log(error, "GET_USER_BY_ID"); // errorHandler next up
        throw new GraphQLError(error.message || "Internal Server Error", {
          extensions: {
            code: error.code || "INTERNAL_SERVER_ERROR",
            http: { status: error.status || 500 },
          },
        });
      }
    },
    whoAmI: async (parent, args, contextValue, info) => {
      try {
        const { db, authentication } = contextValue;
        const auth = await authentication();
        const users = await db.collection(COLLECTION_NAME);

        const user = await users.findOne({
          _id: new ObjectId(auth._id),
        });

        if (!user)
          throw {
            message: "User not found",
            code: "NOT_FOUND",
            status: 404,
          };

        return user;
      } catch (error) {
        console.log(error, "GET_USER_BY_ID"); // errorHandler next up
        throw new GraphQLError(error.message || "Internal Server Error", {
          extensions: {
            code: error.code || "INTERNAL_SERVER_ERROR",
            http: { status: error.status || 500 },
          },
        });
      }
    },

    talentsForMe: async (parent, args, contextValue, info) => {
      try {
        const { db, authentication } = contextValue;
        const auth = await authentication();

        const users = await db.collection(COLLECTION_NAME);

        const talents = await db.collection("Talents");

        const userTags = (await users.findOne({ username: auth.username }))
          .tags;

        const userLocations = (await users.findOne({
          username: auth.username,
        })).userLocations;

        // Find talents with common tags and talent locations
        const talentsWithCommonTagsAndLocations = await talents
          .find({
            tags: { $in: userTags },
            talentLocations: { $in: userLocations },
          })
          .toArray();

        // console.log(talentsWithCommonTagsAndLocations.length, "AAAAAAAA");

        const talentsForMe = {
          _id: new ObjectId(auth._id),
          username: auth.username,
          talentsForMe: talentsWithCommonTagsAndLocations,
        };

        // console.dir(talentsForMe, { depth: null });

        return talentsForMe;
      } catch (error) {
        console.log(error, "TALENT_FOR_ME"); // errorHandler next up
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
    register: async (parent, args, contextValue, info) => {
      try {
        const { newUser } = args;

        // console.log(validateEmail(newUser.email), "SINI");

        // console.log(newUser.email, "SINI");

        if (!newUser.email)
          throw {
            message: "Email is required",
            code: "BAD_REQUEST",
            status: 400,
          };

        if (!newUser.password)
          throw {
            message: "Password is required",
            code: "BAD_REQUEST",
            status: 400,
          };
        if (!newUser.username)
          throw {
            message: "Username is required",
            code: "BAD_REQUEST",
            status: 400,
          };
        if (!newUser.name)
          throw {
            message: "Name is required",
            code: "BAD_REQUEST",
            status: 400,
          };
        if (!newUser.gender)
          throw {
            message: "Gender is required",
            code: "BAD_REQUEST",
            status: 400,
          };

        if (newUser.tags.length === 0)
          throw {
            message: "You must choose at least 1 tag, Quiz incomplete",
            code: "BAD_REQUEST",
            status: 400,
          };
        if (newUser.userLocations.length === 0)
          throw {
            message: "You must choose at least 1 location, Quiz incomplete",
            code: "BAD_REQUEST",
            status: 400,
          };

        const isEmail = validateEmail(newUser.email);
        if (!isEmail)
          throw {
            message: "Invalid Email",
            code: "BAD_REQUEST",
            status: 400,
          };

        if (newUser.password.length < 5)
          throw {
            message: "Password is too short (minimum of 5 characters)",
            code: "BAD_REQUEST",
            status: 400,
          };

        const { db } = contextValue;

        const users = await db.collection(COLLECTION_NAME);

        const findUserEmail = await users.findOne({ email: newUser.email });

        const findUserUsername = await users.findOne({
          username: newUser.username,
        });

        // console.log(findUserEmail, findUserUsername, "SINSI");

        if (findUserEmail)
          throw {
            message: "Email already exists",
            code: "BAD_REQUEST",
            status: 400,
          };

        if (findUserUsername)
          throw {
            message: "Username already exists",
            code: "BAD_REQUEST",
            status: 400,
          };

        const insertedUser = await users.insertOne({
          ...newUser,
          password: hashPw(newUser.password),
          // role: "user",
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        return {
          ...newUser,
          _id: insertedUser.insertedId,
          role: "user",
        };
      } catch (error) {
        console.log(error, "ADD_USER"); // errorHandler next up
        throw new GraphQLError(error.message || "Internal Server Error", {
          extensions: {
            code: error.code || "INTERNAL_SERVER_ERROR",
            http: { status: error.status || 500 },
          },
        });
      }
    },

    login: async (_, args, contextValue) => {
      const { db } = contextValue;
      const { email, password } = args;

      try {
        if (!email)
          throw {
            message: "Email is required",
            code: "BAD_REQUEST",
            status: 400,
          };

        if (!password)
          throw {
            message: "Password is required",
            code: "BAD_REQUEST",
            status: 400,
          };

        const users = await db.collection(COLLECTION_NAME);

        const findUser = await users.findOne({ email });

        if (!findUser)
          throw {
            message: "Wrong email or password",
            code: "BAD_REQUEST",
            status: 400,
          };

        const comparedPw = comparePwDecrypted(password, findUser.password);

        // console.log("MASUK SINI")

        if (!comparedPw)
          throw {
            message: "Wrong email or password",
            code: "BAD_REQUEST",
            status: 400,
          };

        const payload = {
          _id: findUser._id,
          email,
          role: findUser.role,
          username: findUser.username,
        };

        const access_token = signToken(payload);

        return { access_token };
      } catch (error) {
        console.log(error, "LOGIN"); // errorHandler next up
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
