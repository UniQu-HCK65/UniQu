import React from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WHO_AM_I_TALENT } from "../queries/query";
import { useQuery } from "@apollo/client";

export default function ListBookingTalent() {
  const { loading, error, data } = useQuery(WHO_AM_I_TALENT);
  const talentData = data.whoAmITalent;
  console.log(talentData, "talent data di listbooking");

  return (
    <View style={styles.container}>
      <View style={styles.overlayContainer}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1658749440631-9b7c88cd75db?q=80&w=3386&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          }}
          style={styles.topImage}
        />
        <View style={styles.overlay}></View>
        <Text style={styles.welcomingName}>Hi, {talentData.name}!</Text>
        <Text style={styles.welcoming}>How are you?</Text>
      </View>

      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>Your Request:</Text>
          <FlatList
            data={talentData.talentBookings}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View key={item._id} style={styles.cardUser}>
                <View style={styles.infoUser}>
                  <Image
                    source={{ uri: item.userImgUrl }}
                    style={styles.avatar}
                  />
                  <View>
                    <View style={styles.userDetail}>
                      <Text style={styles.name}>{item.userName}</Text>
                      <Text style={styles.status}>{item.bookStatus}</Text>
                    </View>
                    <Text style={styles.status}>@{item.userNick}</Text>
                  </View>
                </View>
              </View>
            )}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e8e9f0",
  },
  overlayContainer: {
    position: "relative",
  },
  topImage: {
    width: "100%",
    height: 250,
    borderBottomEndRadius: 70,
    borderBottomStartRadius: 70,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "black",
    opacity: 0.5,
    borderBottomEndRadius: 70,
    borderBottomStartRadius: 70,
  },
  welcomingName: {
    position: "absolute",
    left: 20,
    top: 20,
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    marginTop: 80,
    padding: 20,
  },
  welcoming: {
    position: "absolute",
    left: 20,
    top: 20,
    fontSize: 20,
    fontWeight: "300",
    color: "white",
    marginTop: 115,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    marginTop: 20,
    zIndex: 10,
    marginBottom: 40,
  },
  cardContainer: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
  },
  card: {
    flex: 1,
    marginTop: -30,
    width: "90%",
    height: 350,
    borderRadius: 40,
    backgroundColor: "white",
    // backgroundColor: "yellow",

    alignItems: "center",
    marginBottom: 20,
  },
  cardUser: {
    width: 300,
    height: 70,
    borderRadius: 15,
    backgroundColor: "white",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  infoUser: {
    flexDirection: "row",
    gap: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userDetail: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 50,
  },
  status: {
    color: "grey",
    fontSize: 11,
  },
  name: {
    fontWeight: "bold",
    fontSize: 13,
  },
});
