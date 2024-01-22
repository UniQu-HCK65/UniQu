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
    password: String
    role: String!
    gender: String
    imgUrl: String
    tags: [String]
    userLocations: [String]
    createdAt: String
    updatedAt: String
  }

  input NewUser {
    name: String
    username: String!
    email: String!
    password: String!
    gender: String
    imgUrl: String
    tags: [String]
    userLocations: [String]
  }

  input EditUser {
    name: String
    password: String
    imgUrl: String
    tags: [String]
    userLocations: [String]
  }

  type ProfileUser {
    _id: ID
    name: String
    username: String
    email: String
    password: String,
    role: String,
    imgUrl: String
    gender: String,
    tags: [String],
    userLocations: [String]
    userBookings: [Booking]
    userTransactions: [Transaction]
    createdAt: String
    updatedAt: String
  }

  type TalentForMe {
    _id: ID
    username: String
    talentsForMe:[Talent]
  }

  type Query {
    users: [User]
    talentsForMe: TalentForMe
    whoAmI: ProfileUser
    getUserById(userId: ID): ProfileUser
  }

  type Auth {
    access_token: String
    role: String
  }

  type Mutation {
  register(newUser:NewUser): User
  login(email:String, password:String): Auth
  editProfile(editUser:EditUser): User
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
    whoAmI: async (parent, args, contextValue, info) => {
      try {
        const { db, authentication } = contextValue;
        const auth = await authentication();

        const role = auth.role;

        if (role !== "user") {
          throw {
            message: "Forbidden, you are not a user",
            code: "FORBIDDEN",
            status: 403,
          };
        }

        const userId = auth._id;

        if (!userId)
          throw {
            message: "User not found",
            code: "NOT_FOUND",
            status: 404,
          };

        const users = await db.collection(COLLECTION_NAME);

        const user = await users
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
                foreignField: "UserId",
                as: "userBookings",
              },
            },
            {
              $lookup: {
                from: "Transactions",
                localField: "_id",
                foreignField: "UserId",
                as: "userTransactions",
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

        return user[0];
      } catch (error) {
        console.log(error, "GET_USER_PROFILE"); // errorHandler next up
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

        const role = auth.role;

        if (role !== "user") {
          throw {
            message: "Forbidden, you are not a user",
            code: "FORBIDDEN",
            status: 403,
          };
        }

        const users = await db.collection(COLLECTION_NAME);

        const talents = await db.collection("Talents");

        const userTags = (await users.findOne({ username: auth.username }))
          .tags;

        const userLocations = (
          await users.findOne({
            username: auth.username,
          })
        ).userLocations;

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

    getUserById: async (parent, args, contextValue, info) => {
      try {
        const { db, authentication } = contextValue;
        const auth = await authentication();

        const { userId } = args;

        const role = auth.role;

        const users = await db.collection(COLLECTION_NAME);

        const getUser = await users
          .aggregate([
            {
              $match: {
                _id: new ObjectId(userId),
              },
            },
            {
              $lookup: {
                from: "Bookings",
                localField: "_id",
                foreignField: "UserId",
                as: "userBookings",
              },
            },
            {
              $lookup: {
                from: "Transactions",
                localField: "_id",
                foreignField: "UserId",
                as: "userTransactions",
              },
            },
          ])
          .toArray();
        // console.log(user);

        if (getUser.length < 1)
          throw {
            message: "User not found",
            code: "NOT_FOUND",
            status: 404,
          };

        return getUser;
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
          role: "user",
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        return {
          ...newUser,
          _id: insertedUser.insertedId,
          role: "user",
        };
      } catch (error) {
        console.log(error, "REGISTER"); // errorHandler next up
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

        const talents = await db.collection("Talents");

        const findTalent = await talents.findOne({ email });

        if (!findUser && !findTalent)
          throw {
            message: "Wrong email or password",
            code: "BAD_REQUEST",
            status: 400,
          };

        let comparedPw = false;

        if (findUser) {
          comparedPw = comparePwDecrypted(password, findUser.password);
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
          //NGENG

          return { access_token, role: payload.role };
        } else if (findTalent) {
          comparedPw = comparePwDecrypted(password, findTalent.password);

          if (!comparedPw)
            throw {
              message: "Wrong email or password",
              code: "BAD_REQUEST",
              status: 400,
            };

          const payload = {
            _id: findTalent._id,
            email,
            role: findTalent.role,
            username: findTalent.username,
          };

          const access_token = signToken(payload);

          return { access_token, role: payload.role };
        }
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
    editProfile: async (parent, args, contextValue, info) => {
      try {
        const { db, authentication } = contextValue;
        const auth = await authentication();
        const { editUser } = args;

        const role = auth.role;

        if (role !== "user") {
          throw {
            message: "Forbidden, you are not a user",
            code: "FORBIDDEN",
            status: 403,
          };
        }

        const users = await db.collection(COLLECTION_NAME);

        const findUserCheck = await users.findOne({
          _id: new ObjectId(auth._id),
        });

        if (findUserCheck.username !== auth.username) {
          throw {
            message: "Forbidden, you are not the user",
            code: "FORBIDDEN",
            status: 403,
          };
        }

        const updateUserData = await users.updateOne(
          {
            _id: new ObjectId(auth._id),
          },
          {
            $set: {
              ...editUser,
              password: hashPw(editUser.password),
              updatedAt: new Date(),
            },
          }
        );

        const findUpdatedUser = await users.findOne({
          _id: new ObjectId(auth._id),
        });

        return findUpdatedUser;
      } catch (error) {
        console.log(error, "EDIT_USER_PROFILE"); // errorHandler next up
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
