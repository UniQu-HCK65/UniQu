import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { WHO_AM_I_USER } from "../queries/query";
import { useQuery } from "@apollo/client";
import LogoutButton from "../components/logoutButton";
import { useFocusEffect } from "@react-navigation/native";

export default function ProfileUser({ navigation }) {
  const { loading, error, data, refetch } = useQuery(WHO_AM_I_USER, {
    refetcQueries: [WHO_AM_I_USER],
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

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error fetching data</Text>;
  }

  const { whoAmI } = data;
  // console.log(whoAmI.userBookings.length, "<<< oiiii");
  const paymentId = whoAmI.userTransactions[0]?.paymentId;

  // console.log(paymentId, ">> hai");

  const convertToDate = (timestamp) => {
    const date = new Date(parseInt(timestamp));
    return date.toLocaleDateString();
  };

  console.log(data, "dataa user");
  return (
    <ScrollView style={styles.container}>
      <View>
        <View>
          <View style={styles.photoProfileContainer}>
            <Image
              source={{
                uri: whoAmI.imgUrl,
              }}
              style={styles.photoImage}
            />

            <View style={styles.buttonEdit}>
              <TouchableOpacity
                onPress={() => navigation.navigate("Edit Profile")}
              >
                <Feather name="edit-2" size={25} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View>
          <View>
            <View style={styles.cardOption}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', marginRight: 25}}>
                <Text style={styles.fontOption}>{whoAmI.name}</Text>
                <LogoutButton />
              </View>
            </View>
          </View>

          <View>
            <View style={styles.cardOption}>
              <View>
                <Text style={styles.usernameStyle}>@{whoAmI.username}</Text>
              </View>
            </View>
          </View>

          <View>
            <View style={styles.cardOption}>
              <View>
                <Text style={styles.tagsStyle}>Tags</Text>
              </View>
            </View>

            <View style={styles.cardTagsStyle}>
              {whoAmI.tags.map((tag, index) => (
                <View style={styles.tagsDetailStyle} key={index}>
                  <Text style={{ color: "white" }}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>

          <View>
            <View style={styles.cardOption}>
              <View>
                <Text style={styles.tagsStyle}>Location</Text>
              </View>
            </View>

            <View style={styles.cardTagsStyle}>
              {whoAmI.userLocations.map((userLocation, index) => (
                <View style={styles.locationStyle} key={index}>
                  <Text style={{ color: "white" }}>{userLocation}</Text>
                </View>
              ))}
            </View>
          </View>

          <View>
            <View style={{}}>
              <View>
                <Text style={styles.tagsStyle}>Booking History</Text>
              </View>
            </View>

            <View style={{}}>
              {whoAmI.userBookings.map((booking, index) => (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Status Booking", {
                      bookingId: booking._id,
                    })
                  }
                  style={styles.historyStyle}
                  key={index}
                >
                  {/* <View style={styles.historyContainer}>
                    <View>
                      <Text style={styles.historyLabel}>No. Payment</Text>
                    </View>
                    <View >
                      <Text style={{ width: 273 }}>
                        {" "}
                        : {paymentId ? paymentId : "-"}
                      </Text>
                    </View>
                  </View> */}

                  <View style={styles.historyContainer}>
                    <View>
                      <Text style={styles.historyLabel}>Date</Text>
                    </View>
                    <View style={{ marginLeft: 60 }}>
                      <Text>: {convertToDate(booking.bookDate)}</Text>
                    </View>
                  </View>

                  <View style={styles.historyContainer}>
                    <View>
                      <Text style={styles.historyLabel}>Shopper</Text>
                    </View>
                    <View style={{ marginLeft: 39 }}>
                      <Text>: {booking.talentName}</Text>
                    </View>
                  </View>

                  <View style={styles.historyContainer}>
                    <View>
                      <Text style={styles.historyLabel}>Session</Text>
                    </View>
                    <View style={{ marginLeft: 42 }}>
                      <Text>: {booking.bookSession}</Text>
                    </View>
                  </View>

                  <View style={styles.historyContainer}>
                    <View>
                      <Text style={styles.historyLabel}>Status</Text>
                    </View>
                    <View style={{ marginLeft: 51 }}>
                      <Text>: {booking.bookStatus}</Text>
                    </View>
                  </View>

                  <View style={styles.historyContainer}>
                    <View>
                      <Text style={styles.historyLabel}>Location</Text>
                    </View>
                    <View style={{ marginLeft: 38 }}>
                      <Text>: {booking.bookLocation}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // paddingHorizontal: 20,
    // paddingTop: 40,
  },
  photoProfileContainer: {
    height: 300,
    marginBottom: 20,
  },
  photoImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    // resizeMode: "cover",
    // borderBottomRightRadius: 15,
    // borderBottomLeftRadius: 15,
    borderRadius: 20,
  },
  profileContainer: {
    alignItems: "center",
    position: "absolute",
    top: 35,
    left: 20,
    right: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 75,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#fff",
  },
  profileBio: {
    fontSize: 16,
    color: "#fff",
  },
  fontOption: {
    fontSize: 25,
    marginTop: 30,
    marginLeft: 25,
  },
  buttonEdit: {
    backgroundColor: "white",
    alignItems: "center",
    position: "absolute",
    top: 260,
    left: 310,
    right: 20,
    borderRadius: 75,
    marginBottom: 10,
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "grey",
    shadowOffset: {
      width: 0,
      height: 0.1,
    },
    shadowOpacity: 1,
    shadowRadius: 1,
  },
  usernameStyle: {
    fontSize: 15,
    color: "#4e4e4e",
    marginTop: -25,
    marginLeft: 25,
  },
  tagsStyle: {
    fontSize: 21,
    marginTop: 30,
    marginLeft: 25,
  },
  tagsDetailStyle: {
    marginLeft: 25,
    marginTop: 10,
    backgroundColor: "#4e4e4e",
    width: 110,
    // width: 120,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTagsStyle: {
    flexWrap: "wrap",
    flexDirection: "row",
  },
  locationStyle: {
    marginLeft: 25,
    marginTop: 10,
    backgroundColor: "#4e4e4e",
    width: 120,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  historyStyle: {
    marginTop: 10,
    borderBottomColor: "grey",
    borderBottomWidth: 1,
    // width: 330,
    height: 120,
    justifyContent: "center",
    borderRadius: 8,
    shadowColor: "#000",
    marginBottom: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginHorizontal: 30,
  },
  historyContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 1,
    // backgroundColor: "white",
    marginLeft: 15,
  },
});
