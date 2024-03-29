import { gql, useQuery } from "@apollo/client";
import {
  ActivityIndicator,
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
import React, { useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import Ionicons from 'react-native-vector-icons/EvilIcons';

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
    case "Reviewed":
      return "#0298";
    case "expired":
      return "#cb3444";
    default:
      return "##000000";
  }
};

export default function HomeforTalent({ navigation }) {
  const { loading, error, data, refetch } = useQuery(WHO_AM_I_TALENT, {
    refetchQueries: [WHO_AM_I_TALENT],
  });

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          await refetch();
        } catch (error) {
          console.log(error, "error refetch");
        }
      };
      fetchData();
    }, [])
  );

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

  console.log(JSON.stringify(data, null, 2))

  const handleRefresh = async () => {
    await refetch();
  }

  const renderListBooking = ({ item }) => {

    return (
      <View style={styles.containerHeader}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Konfirmasi Booking", { bookingId: item._id })
          }
          style={styles.cardContainer}
        >
          <View style={{ flexDirection: "row" }}>
            <View style={styles.image}>
              <Image
                source={{
                  uri: item.userImgUrl,
                }}
                style={styles.profileImage}
              />
            </View>

            <View style={styles.detailInformasi}>
              <View style={styles.profileDetails}>
                <View style={styles.detailName}>
                  <Text style={styles.nameText}>{item.userName}</Text>

                  <Text style={styles.descriptionText}>@{item.userNick}</Text>
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
            <View style={{ flexDirection: "row", marginTop: 4 }}>
              <View>
                <Text
                  style={{
                    ...styles.subJudul,
                    marginLeft: 3,
                    fontSize: 17,
                  }}
                >
                  Book Date
                </Text>
              </View>
              <View>
                <Text style={{ ...styles.fillSubJudul2, marginLeft: 41 }}>
                  : {convertToDate(item.bookDate)}{" "}
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", marginTop: 4 }}>
              <View>
                <Text
                  style={{
                    ...styles.subJudul,
                    marginLeft: 3,
                    fontSize: 17,
                  }}
                >
                  Book Session
                </Text>
              </View>
              <View>
                <Text style={{ ...styles.fillSubJudul2, marginLeft: 20 }}>
                  : {item.bookSession}{" "}
                </Text>
              </View>
            </View>

            <View style={styles.detailsbooktransaction}>
              <View>
                <Text style={styles.subJudul}>Location</Text>
              </View>
              <View>
                <Text style={styles.fillSubJudul}>: {item.bookLocation}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View>
        <View>
          <View>
            <View style={styles.listStyle}>
              <View style={{ flexDirection: "row", justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: 'black', fontSize: 25, fontWeight: 'bold' }}>Hi, {data?.whoAmITalent.name} !</Text>
                <TouchableOpacity onPress={handleRefresh} style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="refresh" size={35} color="black" style={{ marginRight: 20 }} />
                </TouchableOpacity>
              </View>
              <Text style={{ color: 'black', fontSize: 18, fontWeight: '400', marginTop: 5 }}>Your bookings list </Text>
              <View style={{ height: 1, backgroundColor: 'grey', marginTop: 10, marginRight: 20, marginTop: 20 }}></View>
            </View>
          </View>

          <View style={styles.containerHeader}>
            {loading ? (
              <ActivityIndicator size="large" color="#5a84a5" />
            ) : (
              <FlatList
                data={data.whoAmITalent.talentBookings}
                keyExtractor={(item) => item._id}
                renderItem={renderListBooking}
              />
            )}
          </View>
        </View>
      </View>
    </View>
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
    marginTop: "15%",
    marginBottom: 20,
  },
  textBookings: {
    fontWeight: "bold",
    fontSize: 25,
  },
  cardContainer: {
    backgroundColor: "#fff",
    // backgroundColor: "red",
    borderLeftWidth: 5,
    padding: 20,
    borderRadius: 28,
    marginBottom: 13,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    borderLeftColor: "grey",
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
    fontSize: 13,
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
    marginTop: 13,
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
    marginLeft: 53,
    // backgroundColor: "red"
  },
  fillSubJudul2: {
    fontSize: 17,
    // marginLeft: 30,
    // backgroundColor: "yellow"
  },
});
