import React, { useContext, useEffect } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useQuery } from "@apollo/client";
import { WHO_AM_I_USER } from "../queries/query";

export default function ListChat({ navigation }) {
  // console.log(isLoggedIn, "AAAAAAAA")
  const { loading, error, data } = useQuery(WHO_AM_I_USER);

  const userLoggedInId = data?.whoAmI?._id;
  const userLoggedInName = data?.whoAmI?.name;
  console.log(userLoggedInId, loading, error, "qqqq");
  const userTargetId = "anything you want here";

  const getUserLoggedInId = async () => {
    const id = await SecureStore.getItemAsync("userId");
    return id;
  };

  const handleToChatRoom = () => {

    console.log("chat room pressed");
    navigation.navigate("Chat", {
        roomName: `123`,
        // roomName: `${userLoggedInId}-${userTargetId}`,
        userLoggedInName: userLoggedInName,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Message</Text>
      </View>

      <TouchableOpacity onPress={handleToChatRoom} style={styles.chatCard}>
        <View style={styles.cardContent}>
          <Image
            source={{
              uri: "https://media.licdn.com/dms/image/C5603AQH4biWBcrbxIg/profile-displayphoto-shrink_800_800/0/1662896217186?e=1710979200&v=beta&t=bo6mltYb6JJ9Fz8J5_h7kyI4OJYNkiI0tNPx69stk-g",
            }}
            style={styles.avatar}
          />
          <View style={styles.textContainer}>
            <Text style={styles.name}>Maldini Junior</Text>
            <Text style={styles.message}>Love u wahysssu</Text>
          </View>
          <Text style={styles.time}>12.00 AM</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    marginHorizontal: 30,
    marginTop: 60,
    gap: 10,
    marginBottom: 15,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 20,
  },
  chatCard: {
    width: "100%",
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  cardContent: {
    height: 60,
    borderRadius: 15,
    backgroundColor: "#f1f1f1",
    padding: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 100,
  },
  textContainer: {
    flex: 1,
    flexDirection: "column",
    marginLeft: 10,
  },
  name: {
    fontWeight: "bold",
  },
  message: {
    fontSize: 11,
  },
  time: {
    fontSize: 10,
  },
});
