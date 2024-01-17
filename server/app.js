if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const { verifyToken } = require("./helpers/jwt");

const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");

const {
  typeDefs: userTypeDefs,
  resolvers: userResolvers,
} = require("./schemas/users");

const {
  typeDefs: talentTypeDefs,
  resolvers: talentResolvers,
} = require("./schemas/talents");

// const {
//   typeDefs: followsTypeDefs,
//   resolvers: followsResolvers,
// } = require("./schemas/follows");

const client = require("./config/configMongo");
const { ObjectId } = require("mongodb");

const server = new ApolloServer({
  typeDefs: [userTypeDefs, talentTypeDefs],
  resolvers: [userResolvers, talentResolvers],
  introspection: true,
});

(async () => {
  try {
    const db = client.db(process.env.DB_NAME);

    const { url } = await startStandaloneServer(server, {
      listen: { port: process.env.PORT || 5555 },
      context: async ({ req, res }) => {
        try {
          return {
            authentication: async () => {
              let token = req.headers.authorization;
              // console.log(token);
              if (!token)
                throw {
                  message: "Invalid Token",
                  code: "UNAUTHORIZED",
                  status: 401,
                };

              const splittedToken = token.split(" ");

              if (splittedToken[0] !== "Bearer")
                throw {
                  message: "Invalid Tokena",
                  code: "UNAUTHORIZED",
                  status: 401,
                };

              token = splittedToken[1];

              const payload = verifyToken(token);

              const users = await db.collection("Users");
              // console.log(users, "AUTH");

              const findUser = await users.findOne({
                _id: new ObjectId(payload._id),
              });

              // console.log(findUser);
              if (!findUser)
                throw {
                  message: "Invalid Token",
                  code: "UNAUTHORIZED",
                  status: 401,
                };

              return {
                _id: payload._id,
                username: payload.username,
                role: payload.role,
              };
            },
            db,
          };
        } catch (error) {
          console.log(error, "CONTEXT_APP"); // errorHandler next up
          throw new GraphQLError(error.message || "Internal Server Error", {
            extensions: {
              code: error.code || "INTERNAL_SERVER_ERROR",
              http: { status: error.status || 500 },
            },
          });
        }
      },
    });
    console.log(`🚀 Server ready at: ${url}`);
  } catch (error) {
    console.error(error);
  }
})();
