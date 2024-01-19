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

export default function ProfileUser({ navigation }) {
  return (
    <ScrollView>
      <View style={styles.container}>
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
                <Text style={styles.fontOption}>Nell Foster</Text>
              </View>
            </View>
          </View>

          <View>
            <View style={styles.cardOption}>
              <View>
                <Text style={styles.usernameStyle}>@nell</Text>
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
              <View style={styles.tagsDetailStyle}>
                <Text style={{ color: "white" }}>Sneakers</Text>
              </View>

              <View style={styles.tagsDetailStyle}>
                <Text style={{ color: "white" }}>Wedges</Text>
              </View>

              <View style={styles.tagsDetailStyle}>
                <Text style={{ color: "white" }}>Heels</Text>
              </View>

              <View style={styles.tagsDetailStyle}>
                <Text style={{ color: "white" }}>Purse</Text>
              </View>

              <View style={styles.tagsDetailStyle}>
                <Text style={{ color: "white" }}>Luis Vuitton</Text>
              </View>

              <View style={styles.tagsDetailStyle}>
                <Text style={{ color: "white" }}>Winter Padding</Text>
              </View>
            </View>
          </View>

          <View>
            <View style={styles.cardOption}>
              <View>
                <Text style={styles.tagsStyle}>Location</Text>
              </View>
            </View>

            <View style={styles.cardTagsStyle}>
              <View style={styles.locationStyle}>
                <Text style={{ color: "white" }}>Jakarta Selatan</Text>
              </View>

              <View style={styles.locationStyle}>
                <Text style={{ color: "white" }}>Jakarta Timur</Text>
              </View>

              <View style={styles.locationStyle}>
                <Text style={{ color: "white" }}>Jakarta Barat</Text>
              </View>

              <View style={styles.locationStyle}>
                <Text style={{ color: "white" }}>Jakarta Utara</Text>
              </View>

              <View style={styles.locationStyle}>
                <Text style={{ color: "white" }}>Jakarta Pusat</Text>
              </View>
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
});
