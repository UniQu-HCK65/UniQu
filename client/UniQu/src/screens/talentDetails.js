import {
  Image,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { GET_TALENTS_BY_ID } from "../queries/query";
import { useQuery } from "@apollo/client";

export default function TalentDetails({navigation, route }) {
  const { talentId } = route.params;
  const { loading, error, data } = useQuery(GET_TALENTS_BY_ID, {
    variables: { talentId },
  });

  if (loading) return <ActivityIndicator size="large" color="#5a84a5" />;
  if (error) return <Text>Error: {error.message}</Text>;

  const talent = data.getTalentsById;
  //   console.log(talent, "menungsoooo");

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1637536701369-f815af927b59?q=80&w=3328&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        }}
        style={styles.backgroundImage}
      />
      <View style={styles.overlay}></View>

      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <View style={styles.avatar}>
            <Image
              source={{
                uri: talent.imgUrl,
              }}
              style={styles.avatar}
            />
          </View>

          <View style={styles.textHeaders}>
            <Text style={styles.name}>{talent.name}</Text>
            <Ionicons name="star" size={15} style={{ left: 15 }}></Ionicons>
            <Text style={styles.rating}>
              {talent.rating} ({talent.reviews.length} reviews)
            </Text>
          </View>

          <View style={styles.locationUsernameContainer}>
            <Text style={styles.username}>@{talent.username}</Text>
            <Ionicons name="location" size={13} style={styles.username}>
              {" "}
              {talent.talentLocations.join(", ")}
            </Ionicons>
          </View>

          <Text style={styles.description}>{talent.aboutme}</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ flexDirection: "row" }}
          >
            {talent.tags.map((tag, index) => (
              <View style={styles.tagsCard} key={index}>
                <Text style={styles.nameTags}>{tag}</Text>
              </View>
            ))}
          </ScrollView>

          <ScrollView
            vertical
            showsVerticalScrollIndicator={false}
            style={{
              // justifyContent: "center",
              // alignItems: "center",
              marginHorizontal: 25,
            }}
          >
            <View style={{ gap: 5, height: 50, marginBottom: 300 }}>
              {/* <View style={{marginBottom: 50}}> */}
                <View
                  style={{
                    width: "100%",
                    height: 50,
                    borderColor: "black",
                    borderWidth: 1,
                  }}
                ></View>
                <View
                  style={{
                    width: "100%",
                    height: 50,
                    borderColor: "black",
                    borderWidth: 1,
                  }}
                ></View>
                <View
                  style={{
                    width: "100%",
                    height: 50,
                    borderColor: "black",
                    borderWidth: 1,
                  }}
                ></View>
                <View
                  style={{
                    width: "100%",
                    height: 50,
                    borderColor: "black",
                    borderWidth: 1,
                  }}
                ></View>
                <View
                  style={{
                    width: "100%",
                    height: 50,
                    borderColor: "black",
                    borderWidth: 1,
                  }}
                ></View>
                <View
                  style={{
                    width: "100%",
                    height: 50,
                    borderColor: "black",
                    borderWidth: 1,
                  }}
                ></View>
                <View
                  style={{
                    width: "100%",
                    height: 50,
                    borderColor: "black",
                    borderWidth: 1,
                  }}
                ></View>
                <View
                  style={{
                    width: "100%",
                    height: 50,
                    borderColor: "black",
                    borderWidth: 1,
                  }}
                ></View>
              </View>
            {/* </View> */}
          </ScrollView>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginRight: 50,
            }}
          >
            <TouchableOpacity onPress={() => navigation.navigate("Chat")} style={styles.chatButton}>
              <Ionicons
                name="chatbubbles-outline"
                color="white"
                size={23}
              ></Ionicons>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Booking")} style={styles.bookingButton}>
              <Text style={styles.textButton}>Booking Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    zIndex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "black",
    opacity: 0.2,
    zIndex: 2,
  },
  card: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 630,
    borderRadius: 40,
    backgroundColor: "white",
    marginBottom: 10,
  },
  cardContainer: {
    justifyContent: "center",
    zIndex: 3,
    alignItems: "center",
    margin: 10,
    flexDirection: "column",
  },
  avatar: {
    resizeMode: "cover",
    width: 100,
    height: 100,
    bottom: 20,
    left: 10,
    borderRadius: 50,
  },
  textHeaders: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    bottom: 30,
    left: 25,
  },
  name: {
    fontSize: 25,
    borderColor: "black",
    fontWeight: "500",
  },
  locationUsernameContainer: {
    bottom: 30,
    left: 25,
    gap: 5,
  },
  username: {
    fontSize: 11,
    color: "grey",
    marginTop: 5,
  },

  description: {
    fontSize: 11,
    color: "grey",
    left: 25,
    right: 40,
    bottom: 20,
    marginRight: 60,
  },
  rating: {
    fontSize: 11,
    color: "grey",
    right: 45,
  },
  tagsCard: {
    backgroundColor: "#f0f0f0",
    height: 25,
    width: 83,
    left: 25,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
    marginTop: 5,
  },
  liner: {
    height: 1,
    width: "100%",
    backgroundColor: "black",
    bottom: 160,
    marginRight: 20,
  },
  nameTags: {
    fontSize: 11,
    fontWeight: "500",
  },
  chatButton: {
    backgroundColor: "black",
    height: 50,
    width: 100,
    left: 25,
    borderRadius: 20,
    bottom: 30,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
  },
  bookingButton: {
    backgroundColor: "black",
    height: 50,
    width: 210,
    left: 25,
    borderRadius: 20,
    bottom: 30,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
  },
  textButton: {
    color: "white",
    fontSize: 13,
    fontWeight: "500",
  },
});
