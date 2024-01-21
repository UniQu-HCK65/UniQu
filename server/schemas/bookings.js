const client = require("../config/configMongo");
const { GraphQLError } = require("graphql");
const { ObjectId } = require("mongodb");

const { formatDate } = require("../helpers/dateFormat");

const COLLECTION_NAME = "Bookings";

// your data.
const typeDefs = `#graphql

  type Booking {
    _id: ID
    TalentId: ID
    UserId: ID
    talentName: String
    userName: String
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
  },

  Mutation: {
    book: async (parent, args, contextValue, info) => {
      //BELOM JALAN OK, FLOW
      try {
        const { newBooking } = args;
        const { db, authentication } = contextValue;

        const auth = await authentication();

        const role = auth.role;
        const userId = auth._id;

        const bookings = await db.collection(COLLECTION_NAME);

        const findExistingBooking = await bookings
          .find({
            $and: [
              { TalentId: new ObjectId(newBooking.TalentId) },
              { UserId: new ObjectId(userId) },
            ],
          })
          .toArray();

        console.log(findExistingBooking, "findExistingBooking");

        const ongoingBooking = findExistingBooking.find(
          (booking) =>
            booking.bookStatus !== "ended" || booking.bookStatus !== "denied"
        );

        if (ongoingBooking) {
          throw {
            message:
              "Cannot make another booking with the talent because you have an ongoing booking",
            code: "FORBIDDEN",
            status: 403,
          };
        }

        console.log(newBooking, "newBooking");

        const findTalentName = await db.collection("Talents").findOne({
          _id: new ObjectId(newBooking.TalentId),
        });

        const findUserName = await db.collection("Users").findOne({
          _id: new ObjectId(userId),
        });

        const newBookRequest = await bookings.insertOne({
          ...newBooking,
          TalentId: new ObjectId(newBooking.TalentId),
          UserId: new ObjectId(userId),
          talentName: findTalentName.name,
          userName: findUserName.name,
          bookDate: new Date(newBooking.bookDate),
          bookStatus: "requested",
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        // console.log(newBookRequest.insertedId, "newBookRequest");

        const findCreatedBooking = await bookings.findOne({
          _id: new ObjectId(newBookRequest.insertedId),
        });

        return {
          ...findCreatedBooking,
          bookDate: formatDate(findCreatedBooking.bookDate),
          createdAt: formatDate(findCreatedBooking.createdAt),
          updatedAt: formatDate(findCreatedBooking.updatedAt),
        };
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

        console.log(checkTalent, "checkTalent");
        if (!checkTalent) {
          throw {
            message: "Forbidden, you are not the talent",
            code: "FORBIDDEN",
            status: 403,
          };
        }

        if (findBooking.bookStatus === "requested") {
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
                bookStatus: "booked",
                updatedAt: new Date(),
              },
            }
          );

          //JALANIN BUAT MIDTRANS, MAKE USERID(POSISI SEBAGAI TALENT,HARUS GET USERID)
        } else if (findBooking.bookStatus === "booked") {
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
                bookStatus: "in progress",
                updatedAt: new Date(),
              },
            }
          );
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
              "Booking has already ended or denied, please check your booking id and try again",
            code: "BAD_REQUEST",
            status: 400,
          };
        } else if (findBooking.bookStatus === "denied") {
          throw {
            message:
              "Booking has been denied, please reconfirm with the talent and try booking again",
            code: "BAD_REQUEST",
            status: 400,
          };
        } else if (findBooking.bookStatus === "cancelled") {
          throw {
            message:
              "Booking has been cancelled, please reconfirm with the talent and try booking again",
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
