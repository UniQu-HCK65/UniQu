const client = require("../config/configMongo");
const { GraphQLError } = require("graphql");
const { ObjectId } = require("mongodb");
const midtransClient = require("midtrans-client");
const axios = require("axios");

const { formatDate } = require("../helpers/dateFormat");

const COLLECTION_NAME = "Transactions";

// your data.
const typeDefs = `#graphql

  type Transaction {
    _id: ID
    TalentId: ID
    UserId: ID
    talentName: String
    userName: String
    paymentId: String
    orderId: String
    paymentLink: String
    BookingId: ID
    expiryDate: String
    transactionStatus: String
    paidByAdmin: Boolean
    updatedAt: String
    createdAt: String

  }

  type TransactionLink {
    paymentId: String
    orderId: String
    paymentLink: String
    BookingId: ID
  }

  type Query {
    transactions: [Transaction]
    getTransactionLink(bookingId:ID): TransactionLink
    getTransactionByBookingId(bookingId:ID): Transaction

  }

  type Mutation {
  initPayment(bookingId:ID): Transaction
  updateTransactionStatus(bookingId:ID): Transaction

  }

`;

//MORE?

const resolvers = {
  Query: {
    transactions: async (parent, args, contextValue, info) => {
      try {
        const { db, authentication } = contextValue;
        const auth = await authentication();

        const transactions = await db
          .collection(COLLECTION_NAME)
          .find()
          .toArray();
        return transactions;
      } catch (error) {
        console.log(error, "GET_TRANSACTIONS"); // errorHandler next up
        throw new GraphQLError(error.message || "Internal Server Error", {
          extensions: {
            code: error.code || "INTERNAL_SERVER_ERROR",
            http: { status: error.status || 500 },
          },
        });
      }
    },

    getTransactionLink: async (parent, args, contextValue, info) => {
      try {
        const { bookingId } = args;
        const { db, authentication } = contextValue;
        const auth = await authentication();

        const findBooking = await db.collection("Bookings").findOne({
          _id: new ObjectId(bookingId),
        });

        if (!findBooking) {
          throw {
            message:
              "Booking Not Found, please check your booking id and try again",
            code: "BAD_REQUEST",
            status: 400,
          };
        }

        const transaction = await db.collection(COLLECTION_NAME);

        const findTransaction = await transaction.findOne({
          BookingId: new ObjectId(bookingId),
        });

        if (!findTransaction) {
          throw {
            message:
              "Transaction Not Found, please check your booking id and try again",
            code: "BAD_REQUEST",
            status: 400,
          };
        }
        return {
          paymentId: findTransaction.paymentId,
          orderId: findTransaction.orderId,
          paymentLink: findTransaction.paymentLink,
          BookingId: findTransaction.BookingId,
        };
      } catch (error) {
        console.log(error, "INIT_PAYMENT"); // errorHandler next up
        throw new GraphQLError(error.message || "Internal Server Error", {
          extensions: {
            code: error.code || "INTERNAL_SERVER_ERROR",
            http: { status: error.status || 500 },
          },
        });
      }
    },

    getTransactionByBookingId: async (parent, args, contextValue, info) => {
      try {
        const { bookingId } = args;
        const { db, authentication } = contextValue;
        const auth = await authentication();

        const findBooking = await db.collection("Bookings").findOne({
          _id: new ObjectId(bookingId),
        });

        if (!findBooking) {
          throw {
            message:
              "Booking Not Found, please check your booking id and try again",
            code: "BAD_REQUEST",
            status: 400,
          };
        }

        const transaction = await db.collection(COLLECTION_NAME);

        const findTransaction = await transaction.findOne({
          BookingId: new ObjectId(bookingId),
        });

        if (!findTransaction) {
          throw {
            message:
              "Transaction Not Found, please check your booking id and try again",
            code: "BAD_REQUEST",
            status: 400,
          };
        }

        const orderId = findTransaction.orderId;

        const midtransStatusUrl = `https://api.sandbox.midtrans.com/v2/${orderId}/status`;
        console.log(midtransStatusUrl, "midtransStatusUrl");

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

        console.log(midtransData, "BBBBBB");

        const findUpdatedTransaction = await transaction.findOne({
          _id: new ObjectId(findTransaction._id),
        });

        return findUpdatedTransaction;
      } catch (error) {
        console.log(error, "INIT_PAYMENT"); // errorHandler next up
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
    initPayment: async (parent, args, contextValue, info) => {
      try {
        //OLEH TALENT
        const { bookingId } = args;
        const { db, authentication } = contextValue;
        const auth = await authentication();

        // console.log(newTransaction.BookingId, "newTransaction");

        const talentId = auth._id;

        const transaction = await db.collection(COLLECTION_NAME);

        const findBooking = await db.collection("Bookings").findOne({
          _id: new ObjectId(bookingId),
        });

        const findActiveTransaction = await transaction.findOne({
          BookingId: new ObjectId(bookingId),
          transactionStatus: "unpaid",
        });

        if (findActiveTransaction) {
          throw {
            message:
              "You still have an ongoing transaction, please go to this link: " +
              findActiveTransaction.paymentLink,
            code: "BAD_REQUEST",
            status: 400,
          };
        }

        const findTalent = await db.collection("Talents").findOne({
          _id: new ObjectId(talentId),
        });

        const findUser = await db.collection("Users").findOne({
          _id: new ObjectId(findBooking.UserId),
        });

        let snap = new midtransClient.Snap({
          isProduction: false,
          serverKey: process.env.MIDTRANS_SERVER_KEY,
        });

        const currentDate = new Date();

        const options = {
          year: "2-digit",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        };

        const formattedDate = currentDate.toLocaleDateString("id-Id", options);

        const twoDigitRandom = Math.floor(Math.random() * 90) + 10;

        const orderId = `TRX-BKNG-${Math.random().toString()}`;
        // const orderId = `TRX-BKNG-1`;
        // const orderId = `TRX-BKNG-${bookingId}-${auth.username}-${twoDigitRandom}`;

        const trxAmount = 500_000;

        const midtransTransaction = await snap.createTransaction({
          transaction_details: {
            order_id: orderId,
            gross_amount: trxAmount,
          },
          item_details: [
            {
              id: bookingId,
              price: 500000,
              quantity: 1,
              name:
                findUser.name +
                "'s" +
                "Booking Session with " +
                findTalent.name,
            },
          ],
          customer_details: {
            first_name: findUser.name,
            email: findUser.email,
          },
        });

        // console.log(midtransTransaction, "AAAAAAA");

        const expiryDate = new Date(new Date().getTime() + 2 * 60 * 1000) //NANTI GANTI
        // const expiryDate = new Date(new Date().getTime() + 60 * 60 * 1000)

        const createTransaction = await transaction.insertOne({
          TalentId: new ObjectId(talentId),
          UserId: new ObjectId(findBooking.UserId),
          BookingId: new ObjectId(bookingId),
          talentName: findBooking.talentName,
          userName: findBooking.userName,
          paymentId: midtransTransaction.token,
          orderId: orderId,
          paymentLink: midtransTransaction.redirect_url,
          transactionStatus: "unpaid",
          expiryDate: expiryDate,
          paidByAdmin: false,
          updatedAt: new Date(),
          createdAt: new Date(),
        });

        const findCreatedTransaction = await transaction.findOne({
          _id: new ObjectId(createTransaction.insertedId),
        });

        return findCreatedTransaction;
      } catch (error) {
        console.log(error, "INIT_PAYMENT"); // errorHandler next up
        throw new GraphQLError(error.message || "Internal Server Error", {
          extensions: {
            code: error.code || "INTERNAL_SERVER_ERROR",
            http: { status: error.status || 500 },
          },
        });
      }
    },

    updateTransactionStatus: async (parent, args, contextValue, info) => {
      try {
        const { bookingId } = args;
        const { db, authentication } = contextValue;
        const auth = await authentication();

        const findBooking = await db.collection("Bookings").findOne({
          _id: new ObjectId(bookingId),
        });

        if (!findBooking) {
          throw {
            message:
              "Booking Not Found, please check your booking id and try again",
            code: "BAD_REQUEST",
            status: 400,
          };
        }

        const transaction = await db.collection(COLLECTION_NAME);

        const findTransaction = await transaction.findOne({
          BookingId: new ObjectId(bookingId),
          transactionStatus: "unpaid",
        });

        if (!findTransaction) {
          throw {
            message:
              "No active transaction found, please check your booking id or place a new booking",
            code: "BAD_REQUEST",
            status: 400,
          };
        }

        const orderId = findTransaction.orderId;

        const midtransStatusUrl = `https://api.sandbox.midtrans.com/v2/${orderId}/status`;
        console.log(midtransStatusUrl, "midtransStatusUrl");

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
              findTransaction.paymentLink,
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
              findTransaction.paymentLink,
            code: "UNAUTHORIZED",
            status: 401,
          };
        } else if (midtransData.transaction_status === "expire") {
          const espireTransaction = await transaction.updateOne(
            {
              _id: new ObjectId(findTransaction._id),
            },
            {
              $set: {
                transactionStatus: "expired",
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
              _id: new ObjectId(findTransaction._id),
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
          _id: new ObjectId(findTransaction._id),
        });

        return findUpdatedTransaction;
      } catch (error) {
        console.log(error, "UPDATE_PAYMENT"); // errorHandler next up
        throw new GraphQLError(error.message || "Internal Server Error", {
          extensions: {
            code: error.code || "INTERNAL_SERVER_ERROR",
            http: { status: error.status || 500 },
          },
        });
      }
    },

    ///////////////END OF MUTATIONS/////////////////
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
