if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const { verifyToken } = require("./helpers/jwt");

const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");

const bodyParser = require("body-parser");
//WEEEEE

const { expressMiddleware } = require("@apollo/server/express4");
const {
  ApolloServerPluginDrainHttpServer,
} = require("@apollo/server/plugin/drainHttpServer");
const express = require("express");
const http = require("http");
const cors = require("cors");

const {
  typeDefs: userTypeDefs,
  resolvers: userResolvers,
} = require("./schemas/users");

const {
  typeDefs: talentTypeDefs,
  resolvers: talentResolvers,
} = require("./schemas/talents");

const {
  typeDefs: transactionsTypeDefs,
  resolvers: transactionsResolvers,
} = require("./schemas/transactions");

const {
  typeDefs: bookingsTypeDefs,
  resolvers: bookingsResolvers,
} = require("./schemas/bookings");

const {
  typeDefs: bankDetailsTypeDefs,
  resolvers: bankDetailsResolvers,
} = require("./schemas/bankDetails");

const client = require("./config/configMongo");
const { ObjectId } = require("mongodb");
const { GraphQLError } = require("graphql");
const midtransClient = require("midtrans-client");
const axios = require("axios");

const app = express();
const httpServer = http.createServer(app);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const server = new ApolloServer({
  typeDefs: [
    userTypeDefs,
    talentTypeDefs,
    transactionsTypeDefs,
    bookingsTypeDefs,
    bankDetailsTypeDefs,
  ],
  resolvers: [
    userResolvers,
    talentResolvers,
    transactionsResolvers,
    bookingsResolvers,
    bankDetailsResolvers,
  ],
  introspection: true,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

const startServer = async () => {
  try {
    await server.start();

    const db = client.db(process.env.DB_NAME);

    app.use(
      "/graphql",
      cors(),
      bodyParser.json({ limit: "50mb" }),
      expressMiddleware(server, {
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

                const talents = await db.collection("Talents");

                const findTalent = await talents.findOne({
                  _id: new ObjectId(payload._id),
                });

                const findUser = await users.findOne({
                  _id: new ObjectId(payload._id),
                });

                // console.log(findUser);
                if (!findUser && !findTalent)
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
      })
    );

    app.post("/midtrans-webhook", cors(), express.json(), async (req, res) => {
      try {
        console.log("MASUK");
        console.log("Received Midtrans Webhook:", req.body);
        /*
        Received Midtrans Webhook: {
        va_numbers: [ { va_number: '04273148101', bank: 'bca' } ],
        transaction_time: '2024-01-23 20:23:00',
        transaction_status: 'settlement',
        transaction_id: '405bab46-d157-4f8b-96ed-b4afab05b613',
        status_message: 'midtrans payment notification',
        status_code: '200',
        signature_key: 'cd71d063a313a26d434ffe60d90fd8678b1c4a6653bf79b962d32fddcc043121a995a0abeccb9f0c63a5ad00c3759fe7b7bcea5f0addf681b272a4a8e3b1fc73',
        settlement_time: '2024-01-23 20:23:06',
        payment_type: 'bank_transfer',
        payment_amounts: [],
        order_id: 'TRX-BKNG-0.554764376927015',
        merchant_id: 'G810204273',
        gross_amount: '500000.00',
        fraud_status: 'accept',
        expiry_time: '2024-01-23 20:24:00',
        currency: 'IDR'
        }
        */

        const transaction = await db.collection("Transactions");
        const bookings = await db.collection("Bookings");

        const findTransaction = await transaction.findOne({
          orderId: req.body.order_id,
        });

        const orderId = req.body.order_id;

        // console.log(findTransaction, "AAAAA");

        if (!findTransaction) {
          throw {
            message: "Transaction not found",
            code: "NOT_FOUND",
            status: 404,
          };
        }

        if (
          req.body.status_code !== "200" &&
          (req.body.transaction_status !== "settlement" ||
            req.body.transaction_status !== "capture")
        ) {
          throw {
            message:
              "Transaction has failed please visit the transaction page again",
            code: "BAD_REQUEST",
            status: 400,
          };
        }
        const findActiveTransaction = await transaction.findOne({
          BookingId: new ObjectId(findTransaction.BookingId),
          transactionStatus: "unpaid",
        });

        if (!findActiveTransaction) {
          throw {
            message:
              "No active transaction found, please check your booking id or place a new booking",
            code: "BAD_REQUEST",
            status: 400,
          };
        }

        const midtransStatusUrl = `https://api.sandbox.midtrans.com/v2/${orderId}/status`;
        const midtransOptions = {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Basic ${Buffer.from(
              `${process.env.MIDTRANS_SERVER_KEY}:`
            ).toString("base64")}`,
          },
        };

        const midtransResponse = await axios.get(
          midtransStatusUrl,
          midtransOptions
        );
        const midtransData = midtransResponse.data;

        // console.log(midtransData, "BBBBBB");

        if (midtransData.status_code === "404") {
          throw {
            message:
              "You have an unstarted transaction, please visit this link: " +
              findActiveTransaction.paymentLink,
            code: "NOT_FOUND",
            status: 404,
          };
        } else if (
          midtransData.status_code === "201" &&
          midtransData.transaction_status === "pending"
        ) {
          throw {
            message:
              "You have an unfinished transaction, please visit this link: " +
              findActiveTransaction.paymentLink,
            code: "UNAUTHORIZED",
            status: 401,
          };
        } else if (midtransData.transaction_status === "expire") {
          const espireTransaction = await transaction.updateOne(
            {
              _id: new ObjectId(findActiveTransaction._id),
            },
            {
              $set: {
                transactionStatus: "expired",
                updatedAt: new Date(),
              },
            }
          );

          const expireBooking = await bookings.updateOne(
            {
              _id: new ObjectId(findActiveTransaction.BookingId),
            },
            {
              $set: {
                bookStatus: "expired",
                updatedAt: new Date(),
              },
            }
          );

          throw {
            message:
              "Your transaction has expired, please place an order again",
            code: "UNAUTHORIZED",
            status: 401,
          };
        } else if (
          midtransData.status_code === "200" &&
          (midtransData.transaction_status === "settlement" ||
            midtransData.transaction_status === "capture")
        ) {
          await transaction.updateOne(
            {
              _id: new ObjectId(findActiveTransaction._id),
            },
            {
              $set: {
                transactionStatus: "paid",
                updatedAt: new Date(),
              },
            }
          );
        }

        const findUpdatedTransaction = await transaction.findOne({
          _id: new ObjectId(findActiveTransaction._id),
        });

        if (findUpdatedTransaction.transactionStatus === "paid") {
          await bookings.updateOne(
            {
              _id: new ObjectId(findActiveTransaction.BookingId),
            },
            {
              $set: {
                bookStatus: "in progress",
                updatedAt: new Date(),
              },
            }
          );
        }

        res.status(200).json("Transaction has been updated successfully");
      } catch (error) {
        console.error("Error handling Midtrans Webhook:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    httpServer.listen({ port: process.env.PORT || 5555 }, () => {
      console.log(`🚀 Server ready at http://localhost:5555/graphql`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();

// (async () => {
//   try {
//     const db = client.db(process.env.DB_NAME);

//     const { url } = await startStandaloneServer(server, {
//       listen: { port: process.env.PORT || 5555 },
//       context: async ({ req, res }) => {
//         try {
//           return {
//             authentication: async () => {
//               let token = req.headers.authorization;
//               // console.log(token);
//               if (!token)
//                 throw {
//                   message: "Invalid Token",
//                   code: "UNAUTHORIZED",
//                   status: 401,
//                 };

//               const splittedToken = token.split(" ");

//               if (splittedToken[0] !== "Bearer")
//                 throw {
//                   message: "Invalid Tokena",
//                   code: "UNAUTHORIZED",
//                   status: 401,
//                 };

//               token = splittedToken[1];

//               const payload = verifyToken(token);

//               const users = await db.collection("Users");

//               const talents = await db.collection("Talents");

//               const findTalent = await talents.findOne({
//                 _id: new ObjectId(payload._id),
//               });

//               const findUser = await users.findOne({
//                 _id: new ObjectId(payload._id),
//               });

//               // console.log(findUser);
//               if (!findUser && !findTalent)
//                 throw {
//                   message: "Invalid Token",
//                   code: "UNAUTHORIZED",
//                   status: 401,
//                 };

//               return {
//                 _id: payload._id,
//                 username: payload.username,
//                 role: payload.role,
//               };
//             },
//             db,
//           };
//         } catch (error) {
//           console.log(error, "CONTEXT_APP"); // errorHandler next up
//           throw new GraphQLError(error.message || "Internal Server Error", {
//             extensions: {
//               code: error.code || "INTERNAL_SERVER_ERROR",
//               http: { status: error.status || 500 },
//             },
//           });
//         }
//       },
//     });
//     console.log(`🚀 Server ready at: ${url}`);
//   } catch (error) {
//     console.error(error);
//   }
// })();
