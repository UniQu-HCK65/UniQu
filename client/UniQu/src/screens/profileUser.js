import React from "react";
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

export default function ProfileUser({ navigation }) {
  const { loading, error, data } = useQuery(WHO_AM_I_USER);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error fetching data</Text>;
  }

  const { whoAmI } = data;
  const paymentId = whoAmI.userTransactions[0].paymentId;
  // console.log(paymentId, ">> hai");

  const convertToDate = (timestamp) => {
    const date = new Date(parseInt(timestamp));
    return date.toLocaleDateString();
  };

  return (
    <ScrollView style={styles.container}>
      <View>
        <View>
          <View style={styles.photoProfileContainer}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cHJvZmlsZSUyMHBpY3R1cmVzJTIwbW9kZWxzfGVufDB8fDB8fHww",
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
              <View>
                <Text style={styles.fontOption}>{whoAmI.name}</Text>
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
            <View style={styles.cardOption}>
              <View>
                <Text style={styles.tagsStyle}>Booking History</Text>
              </View>
            </View>

            <View style={styles.cardTagsStyle}>
              {whoAmI.userBookings.map((booking, index) => (
                <View style={styles.historyStyle} key={index}>
                  <View style={styles.historyContainer}>
                    <View>
                      <Text style={styles.historyLabel}>No. Payment</Text>
                    </View>
                    <View style={{ marginLeft: 10 }}>
                      <Text> : {paymentId}</Text>
                    </View>
                  </View>

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
                      <Text style={styles.historyLabel}>Book Seesion</Text>
                    </View>
                    <View style={{ marginLeft: 10 }}>
                      <Text>: Session {booking.bookSession}</Text>
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
                </View>
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
    fontSize: 20,
    color: "#4e4e4e",
    marginTop: 3,
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
    width: 120,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTagsStyle: {
    flexWrap: "wrap",
    flexDirection: "row",
    // backgroundColor:"red"
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
    marginLeft: 25,
    marginTop: 10,
    backgroundColor: "#f4f4f4",
    width: 360,
    height: 120,
    paddingLeft: 20,
    justifyContent: "center",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  historyContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 1,
  },
});
