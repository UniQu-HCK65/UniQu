import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useQuery } from "@apollo/client";
import { WHO_AM_I_TALENT } from "../queries/query";
import LogoutButton from "../components/logoutButton";

export default function ProfileTalent({ navigation }) {
  const { loading, error, data } = useQuery(WHO_AM_I_TALENT); //move ke listbookingdetail

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  const talentData = data.whoAmITalent;
  // console.log(talentData, "profile talent");

  const convertToDate = (timestamp) => {
    const date = new Date(parseInt(timestamp));
    return date.toLocaleDateString();
  };
  //malam guys
  return (
    <ScrollView>
      <View style={styles.container}>
        <View>
          <View>
            <View style={styles.photoProfileContainer}>
              <Image
                source={{
                  uri: talentData.imgUrl,
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
              <View style={{}}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'space-between' }}>
                  <Text style={styles.fontOption}>{talentData.name} </Text>
                  
                </View>
              </View>
            </View>

            <View>
              <View style={styles.cardOption}>
                <View>
                  <Text style={styles.usernameStyle}>
                    @{talentData.username}
                  </Text>
                </View>
              </View>
            </View>

            <View>
              <View style={styles.cardOption}>
                <View>
                  <Text
                    style={{
                      ...styles.usernameStyle,
                      fontStyle: "italic",
                      marginTop: 20,
                      width: 360,
                    }}
                  >
                    {talentData.aboutme}
                  </Text>
                </View>
              </View>
            </View>

            <View>
              <View style={styles.cardOption}>
                <View>
                  <LogoutButton/>
                  <Text style={styles.tagsStyle}>Booking History</Text>

                </View>
              </View>

              {/* move ke listbookingdetail */}
              {talentData.talentBookings.map((booking) => (
                <View key={booking._id} style={styles.cardTagsStyle}>
                  <View style={styles.historyStyle}>
                    <View style={styles.historyContainer}>
                      <View>
                        <Text style={styles.historyLabel}>Date</Text>
                      </View>
                      <View style={{ marginLeft: 62 }}>
                        <Text>: {convertToDate(booking.bookDate)}</Text>
                      </View>
                    </View>

                    <View style={styles.historyContainer}>
                      <View>
                        <Text style={styles.historyLabel}>Client</Text>
                      </View>
                      <View style={{ marginLeft: 54 }}>
                        <Text>: {booking.userName}</Text>
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
    fontSize: 18,
    color: "#4e4e4e",
    marginTop: 3,
    marginLeft: 25,
  },
  tagsStyle: {
    fontSize: 21,
    marginTop: 30,
    marginLeft: 25,
  },
  //   tagsDetailStyle: {
  //     marginLeft: 25,
  //     marginTop: 10,
  //     backgroundColor: "#4e4e4e",
  //     width: 120,
  //     height: 40,
  //     borderRadius: 20,
  //     alignItems: "center",
  //     justifyContent: "center",
  //   },
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
