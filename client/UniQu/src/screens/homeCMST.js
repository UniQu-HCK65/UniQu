import { gql, useQuery } from "@apollo/client";
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WHO_AM_I_TALENT } from "../queries/query";
import LogoutButton from "../components/logoutButton";

// updated

const convertToDate = (timestamp) => {
  const date = new Date(parseInt(timestamp));
  return date.toLocaleDateString();
};

const getStatusColor = (status) => {
  switch (status) {
    case "requested":
      return "#819867";
    case "denied":
      return "#e61c19";
    case "booked":
      return "#cd6b32";
    case "in progress":
      return "#b6b649";
    case "cancelled":
      return "#4e4e4e";
    case "started":
      return "#74649b";
    case "ended":
      return "#5a84a5";
    default:
      return "##000000";
  }
};

export default function HomeforTalent({ navigation }) {
  const { loading, error, data } = useQuery(WHO_AM_I_TALENT);
  console.log(data, "homesct");
  if (loading) return <Text>Mengambil data...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  const talentBookings = data?.whoAmITalent?.talentBookings || [];
  const talentTransactions = data?.whoAmITalent?.talentTransactions || [];

  const newData = talentBookings.map((booking) => {
    const transaction = talentTransactions.find(
      (transaction) => transaction.BookingId === booking._id
    );

    if (transaction) {
      return { ...booking, transaction };
    } else {
      return booking;
    }
  });

  //   console.log(newData,">>new");

  const renderListBooking = ({ item }) => {
    // console.log(item, "itemmmm renderer");

    return (
      <View style={styles.containerHeader}>
        <TouchableOpacity onPress={() => navigation.navigate('Konfirmasi Booking')} style={styles.cardContainer}>
          <View style={{ flexDirection: "row" }}>
            <View style={styles.image}>
              <Image
                source={{
                  uri: data?.whoAmITalent.imgUrl || "",
                }}
                style={styles.profileImage}
              />
            </View>

            <View style={styles.detailInformasi}>
              <View style={styles.profileDetails}>
                <View style={styles.detailName}>
                  <Text style={styles.nameText}>{item.userName}</Text>
                  <Text style={styles.descriptionText}>
                    {item.bookLocation}
                  </Text>
                </View>
              </View>
            </View>

            <View>
              <View
                style={{
                  ...styles.status,
                  backgroundColor: getStatusColor(item.bookStatus),
                }}
              >
                <Text style={styles.onStatus}> {item.bookStatus} </Text>
              </View>
            </View>
          </View>

          <View style={styles.detailsbook}>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontSize: 17 }}> Session {item.bookSession} </Text>
              <Text style={{ fontSize: 17, marginLeft: 177 }}>
                {convertToDate(item.bookDate)}{" "}
              </Text>
            </View>
          </View>

          <View>
            <View style={{ flexDirection: "row", marginTop: 4 }}>
              <View>
                <Text
                  style={{
                    ...styles.subJudul,
                    marginLeft: 3,
                    fontSize: 17,
                  }}
                >
                  Status Payment
                </Text>
              </View>
              <View>
                <Text style={styles.fillSubJudul2}>
                  :{" "}
                  {item?.transaction?.transactionStatus
                    ? item?.transaction?.transactionStatus
                    : " - "}
                </Text>
              </View>
            </View>

            <View style={styles.detailsbooktransaction}>
              <View>
                <Text style={styles.subJudul}>No. Payment</Text>
              </View>
              <View>
                <Text style={styles.fillSubJudul}>
                  :{" "}
                  {item?.transaction?.paymentId
                    ? item?.transaction?.paymentId
                    : " - "}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <View>
          <View>
            <View style={styles.listStyle}>
              <Text style={styles.textBookings}> Bookings </Text>
            </View>
          </View>
          <LogoutButton />

          <View style={styles.containerHeader}>
            <FlatList
              data={newData}
              renderItem={renderListBooking}
              keyExtractor={(item) => item._id}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  listStyle: {
    // backgroundColor: "yellow",
    // margin: 25,
    marginLeft: 20,
    marginTop: 25,
    marginBottom: 20,
  },
  textBookings: {
    fontWeight: "bold",
    fontSize: 25,
  },
  cardContainer: {
    backgroundColor: "#fff",
    // backgroundColor: "red",
    borderLeftWidth: "5",
    padding: 20,
    borderRadius: 28,
    marginBottom: 13,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    borderLeftColor: "#E6A4B4",
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 40,
  },
  image: {
    justifyContent: "center",
    // backgroundColor: "grey"
  },
  containerHeader: {
    marginHorizontal: 10,
    // backgroundColor: "yellow",
  },
  detailInformasi: {
    width: 270,
    paddingLeft: 15,
  },
  detailName: {
    marginBottom: -1,
    width: 270,
    paddingTop: 8,
    // backgroundColor: "yellow",
    width: 160,
  },
  nameText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    // backgroundColor: "red",
    width: 180,
  },
  descriptionText: {
    marginRight: 10,
    fontSize: 15,
    width: 180,
    color: "#666",
    marginBottom: 10,
    textAlign: "justify",
    maxWidth: "100%",
    // backgroundColor: "pink",
  },
  status: {
    // backgroundColor: "#5a84a5",
    marginLeft: -90,
    marginTop: 5,
    borderRadius: 13,
    height: 28,
    width: 90,
  },
  onStatus: {
    fontSize: 17,
    textAlign: "center",
    // marginLeft: 17,
    color: "#f3f9f3",
    marginTop: 5,
    fontWeight: "400",
  },
  detailsbook: {
    // backgroundColor: "lightgrey",
    marginTop: 20,
  },
  detailsbooktransaction: {
    flexDirection: "row",
    marginTop: 3,
    // alignItems: "center",
    margin: 3,
    // backgroundColor: "yellow"
  },
  subJudul: {
    // backgroundColor: "red"
    fontSize: 17,
  },
  fillSubJudul: {
    fontSize: 17,
    marginTop: 1,
    marginLeft: 23,
    // backgroundColor: "red"
  },
  fillSubJudul2: {
    fontSize: 17,
    marginLeft: 3,
    // backgroundColor: "yellow"
  },
});
