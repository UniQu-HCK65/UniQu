const client = require("../config/configMongo");
const { GraphQLError } = require("graphql");
const { ObjectId } = require("mongodb");
const midtransClient = require("midtrans-client");
const axios = require("axios");

const COLLECTION_NAME = "Bookings";

// your data.
const typeDefs = `#graphql

  type Booking {
    _id: ID
    TalentId: ID
    UserId: ID
    talentName: String
    talentNick: String
    userName: String
    userNick: String
    talentImgUrl: String
    userImgUrl:String
    bookDate: String
    bookSession: String
    bookLocation: String
    bookStatus: String
    updatedAt: String
    createdAt: String

  }

  input NewBooking {
    TalentId: ID
    bookDate: String
    bookSession: String
    bookLocation: String
  }

  type Query {
    bookings: [Booking]
    bookingById(bookingId:ID): Booking
  }

  type Mutation {
  book(newBooking:NewBooking) : Booking
  updateBookingStatus(bookingId:ID) : Booking
  denyBooking(bookingId:ID) : Booking
  }
`;

const resolvers = {
  Query: {
    bookings: async (parent, args, contextValue, info) => {
      try {
        const { db, authentication } = contextValue;
        const auth = await authentication();
        const bookings = await db.collection(COLLECTION_NAME).find().toArray();
        return bookings;
      } catch (error) {
        console.log(error, "GET_BOOKINGS"); // errorHandler next up
        throw new GraphQLError(error.message || "Internal Server Error", {
          extensions: {
            code: error.code || "INTERNAL_SERVER_ERROR",
            http: { status: error.status || 500 },
          },
        });
      }
    },
    bookingById: async (parent, args, contextValue, info) => {
      try {
        const { db, authentication } = contextValue;
        const auth = await authentication();
        const { bookingId } = args;

        const booking = await db.collection(COLLECTION_NAME);

        const getBooking = await booking.findOne({
          _id: new ObjectId(bookingId),
        });

        return getBooking;
      } catch (error) {
        console.log(error, "GET_BOOKING_BY_ID"); // errorHandler next up
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
    book: async (parent, args, contextValue, info) => {
      try {
        const { newBooking } = args;
        const { db, authentication } = contextValue;

        const auth = await authentication();

        const role = auth.role;
        const userId = auth._id;

        if (!newBooking.TalentId) {
          throw {
            message: "TalentId is required",
            code: "BAD_REQUEST",
            status: 400,
          };
        }
        if (!newBooking.bookLocation) {
          throw {
            message: "bookLocation is required",
            code: "BAD_REQUEST",
            status: 400,
          };
        }
        if (!newBooking.bookSession) {
          throw {
            message: "bookSession is required",
            code: "BAD_REQUEST",
            status: 400,
          };
        }
        if (!newBooking.TalentId) {
          throw {
            message: "TalentId is required",
            code: "BAD_REQUEST",
            status: 400,
          };
        }

        const currentDate = new Date();

        const requestedDate = new Date(newBooking.bookDate);

        if (requestedDate < currentDate) {
          throw {
            message: "Date cannot be in the past",
            code: "BAD_REQUEST",
            status: 400,
          };
        }

        const bookings = await db.collection(COLLECTION_NAME);

        const findExistingBooking = await bookings
          .find({
            // $and: [
            //   { TalentId: new ObjectId(newBooking.TalentId) },
            //   { UserId: new ObjectId(userId) },
            // ],
            UserId: new ObjectId(userId),
          })
          .toArray();

        // console.log(findExistingBooking, "findExistingBooking");

        const ongoingBooking = findExistingBooking.find(
          (booking) =>
            booking.bookStatus !== "ended" &&
            booking.bookStatus !== "denied" &&
            booking.bookStatus !== "cancelled" &&
            booking.bookStatus !== "Reviewed" &&
            booking.bookStatus !== "expired"
        );

        // console.log(ongoingBooking, "AAAAAAA");

        if (ongoingBooking) {
          throw {
            message:
              "Cannot make another booking with the talent because you have an ongoing booking",
            code: "FORBIDDEN",
            status: 403,
          };
        }

        // console.log(newBooking, "newBooking");

        const findTalent = await db.collection("Talents").findOne({
          _id: new ObjectId(newBooking.TalentId),
        });

        const findUser = await db.collection("Users").findOne({
          _id: new ObjectId(userId),
        });

        const newBookRequest = await bookings.insertOne({
          ...newBooking,
          TalentId: new ObjectId(newBooking.TalentId),
          UserId: new ObjectId(userId),
          talentName: findTalent.name,
          talentNick: findTalent.username,
          userName: findUser.name,
          userNick: findUser.username,
          talentImgUrl: findTalent.imgUrl,
          userImgUrl: findUser.imgUrl,
          bookDate: new Date(newBooking.bookDate),
          bookStatus: "requested",
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const findCreatedBooking = await bookings.findOne({
          _id: new ObjectId(newBookRequest.insertedId),
        });

        return findCreatedBooking;
      } catch (error) {
        console.log(error, "POST_BOOK_USER"); // errorHandler next up
        throw new GraphQLError(error.message || "Internal Server Error", {
          extensions: {
            code: error.code || "INTERNAL_SERVER_ERROR",
            http: { status: error.status || 500 },
          },
        });
      }
    },

    updateBookingStatus: async (parent, args, contextValue, info) => {
      try {
        const { bookingId } = args;
        const { db, authentication } = contextValue;

        const auth = await authentication();

        const role = auth.role;

        const talentId = new ObjectId(auth._id);

        const bookings = await db.collection(COLLECTION_NAME);

        const findBooking = await bookings.findOne({
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

        const findBookingTalentId = findBooking.TalentId;

        const checkTalent = findBookingTalentId.equals(talentId);

        if (findBooking.bookStatus === "requested") {
          //UPDATE FROM REQUESTED TO BOOKED BY TALENT
          if (!checkTalent) {
            throw {
              message: "Forbidden, you are not the talent",
              code: "FORBIDDEN",
              status: 403,
            };
          }

          const talentId = auth._id;

          const transaction = await db.collection("Transactions");

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

          const formattedDate = currentDate.toLocaleDateString(
            "id-Id",
            options
          );

          const twoDigitRandom = Math.floor(Math.random() * 90) + 10;

          const orderId = `TRX-BKNG-${Math.random().toString()}`; //TSTING PURPOSES
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
                name: "Booking Session with " + findTalent.name,
              },
            ],
            customer_details: {
              first_name: findUser.name,
              email: findUser.email,
            },
          });

          // console.log(midtransTransaction, "AAAAAAA");

          const expiryDate = new Date(new Date().getTime() + 2 * 60 * 1000); //NANTI GANTI OI, ini 2 mnt
          //  const expiryDate = new Date(new Date().getTime() + 60 * 60 * 1000);

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

          console.log(
            findCreatedTransaction,
            "findCreatedTransaction FROM UPDATE BOOKING"
          );

          await bookings.updateOne(
            {
              _id: new ObjectId(bookingId),
            },
            {
              $set: {
                bookStatus: "booked",
                updatedAt: new Date(),
              },
            }
          );
        } else if (findBooking.bookStatus === "booked") {
          //UPDATE FROM BOOKED TO IN PROGRESS
          const transaction = await db.collection("Transactions");

          const findActiveTransaction = await transaction.findOne({
            BookingId: new ObjectId(bookingId),
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

          const orderId = findActiveTransaction.orderId;

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
                _id: new ObjectId(bookingId),
              },
              {
                $set: {
                  bookStatus: "in progress",
                  updatedAt: new Date(),
                },
              }
            );
          } else {
            throw {
              message:
                "You have an unpaid transaction, please visit this link: " +
                findActiveTransaction.paymentLink,
              code: "BAD_REQUEST",
              status: 400,
            };
          }
        } else if (findBooking.bookStatus === "in progress") {
          if (role !== "talent") {
            throw {
              message: "Forbidden, you are not a talent",
              code: "FORBIDDEN",
              status: 403,
            };
          }

          await bookings.updateOne(
            {
              _id: new ObjectId(bookingId),
            },
            {
              $set: {
                bookStatus: "started",
                updatedAt: new Date(),
              },
            }
          );
        } else if (findBooking.bookStatus === "started") {
          if (role !== "talent") {
            throw {
              message: "Forbidden, you are not a talent",
              code: "FORBIDDEN",
              status: 403,
            };
          }

          const transaction = await db.collection("Transactions");

          const findResolvedTransaction = await transaction.findOne({
            BookingId: new ObjectId(bookingId),
            transactionStatus: "paid",
          });

          if (!findResolvedTransaction) {
            throw {
              message:
                "No transactions needed to be resolved, please check your booking id and try again",
              code: "BAD_REQUEST",
              status: 400,
            };
          }

          //BAYAR KE TALENT
          const payTalents = db.collection("Talents").updateOne(
            {
              _id: new ObjectId(findResolvedTransaction.TalentId),
            },
            { $inc: { balance: 500000 } },
            { $set: { updatedAt: new Date() } }
          );

          //GANTI STATUS TRANSACTION KE PAIDADMIN
          const updateTransaction = await transaction.updateOne(
            {
              _id: new ObjectId(findResolvedTransaction._id),
            },
            {
              $set: {
                transactionStatus: "paidAdmin",
                paidByAdmin: true,
                updatedAt: new Date(),
              },
            }
          );

          //GANTI STATUS BOOKING KE ENDED
          await bookings.updateOne(
            {
              _id: new ObjectId(bookingId),
            },
            {
              $set: {
                bookStatus: "ended",
                updatedAt: new Date(),
              },
            }
          );
        } else if (findBooking.bookStatus === "ended") {
          throw {
            message:
              "Booking session has already ended, please check your booking id and try again",
            code: "BAD_REQUEST",
            status: 400,
          };
        } else if (findBooking.bookStatus === "denied") {
          throw {
            message:
              "Booking ession has been denied, please reconfirm with the talent and try booking again",
            code: "BAD_REQUEST",
            status: 400,
          };
        } else if (findBooking.bookStatus === "cancelled") {
          throw {
            message:
              "Booking session has been cancelled, please reconfirm with the talent and try booking again",
            code: "BAD_REQUEST",
            status: 400,
          };
        } else if (findBooking.bookStatus === "expired") {
          throw {
            message:
              "Booking session has been expired, please try booking again",
            code: "BAD_REQUEST",
            status: 400,
          };
        }

        const findUpdatedBooking = await bookings.findOne({
          _id: new ObjectId(bookingId),
        });
        return findUpdatedBooking;
      } catch (error) {
        console.log(error, "UPDATE_STATUS_BOOKING"); // errorHandler next up
        throw new GraphQLError(error.message || "Internal Server Error", {
          extensions: {
            code: error.code || "INTERNAL_SERVER_ERROR",
            http: { status: error.status || 500 },
          },
        });
      }
    },

    denyBooking: async (parent, args, contextValue, info) => {
      try {
        const { bookingId } = args;
        const { db, authentication } = contextValue;

        const auth = await authentication();

        const role = auth.role;
        const talentId = new ObjectId(auth._id);

        if (role !== "talent") {
          throw {
            message: "Forbidden, you are not a talent",
            code: "FORBIDDEN",
            status: 403,
          };
        }
        const bookings = await db.collection(COLLECTION_NAME);

        const findBooking = await bookings.findOne({
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

        const findBookingTalentId = findBooking.TalentId;

        const checkTalent = findBookingTalentId.equals(talentId);

        console.log(checkTalent, "checkTalent");
        if (!checkTalent) {
          throw {
            message: "Forbidden, you are not the talent",
            code: "FORBIDDEN",
            status: 403,
          };
        }

        if (findBooking.bookStatus !== "requested") {
          throw {
            message:
              "Can't cancel / deny request, the booking has either started or finished",
            code: "FORBIDDEN",
            status: 403,
          };
        }

        await bookings.updateOne(
          {
            _id: new ObjectId(bookingId),
          },
          {
            $set: {
              bookStatus: "denied",
              updatedAt: new Date(),
            },
          }
        );

        const findUpdatedBooking = await bookings.findOne({
          _id: new ObjectId(bookingId),
        });

        return findUpdatedBooking;
      } catch (error) {
        console.log(error, "POST_BOOK_USER"); // errorHandler next up
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
