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
import { GET_TALENTS_BY_ID, GET_USER_CHATLIST } from "../queries/query";
import { useQuery, useLazyQuery } from "@apollo/client";

export default function TalentDetails({ navigation, route }) {
  const { talentId } = route.params;
  const { loading, error, data } = useQuery(GET_TALENTS_BY_ID, {
    variables: { talentId },
  });
  const {
    loading: loadingUser,
    error: errorUser,
    data: dataUserChatlist,
  } = useQuery(GET_USER_CHATLIST);

  if (loading) return <ActivityIndicator size="large" color="#5a84a5" />;
  if (error) return <Text>Error: {error.message}</Text>;

  const talent = data.getTalentsById;

  const totalReviewers = new Set();
  if (talent.reviews && Array.isArray(talent.reviews)) {
    talent.reviews.forEach((review) => totalReviewers.add(review.reviewerName));
  }


  let roomName1 = "0";
  let roomName2 = "0"

  function handleToChatRoom(chatData){
    console.log(roomName1, roomName2, "<<< roomsssss di dalam")
    console.log(error, "<<")
    
    
    navigation.navigate('Chat', chatData)
  }
  roomName1 = dataUserChatlist?.getUserChatlist?._id
  roomName2 = talentId
  let chatData = {
    roomName: `${roomName1}-${roomName2}`,
    userLoggedInName: dataUserChatlist?.getUserChatlist?.name,
    userLoggedInImgUrl: dataUserChatlist?.getUserChatlist?.imgUrl,
  }
  console.log(dataUserChatlist, "<<< dataUserChatlist di luar")


  // console.log(talent, "menungsoooo");

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
            <Ionicons name="star" size={13} color={"#85803a"} style={{ left: 19 }}></Ionicons>
            <Text style={styles.rating}>
              {(talent.rating / talent.reviews?.length).toFixed(1)} ({totalReviewers.size}) reviews
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
            style={{ flexDirection: "row", maxWidth: 390 }}
          >
            {talent.tags.map((tag, index) => (
              <View style={styles.tagsCard} key={index}>
                <Text style={styles.nameTags}>{tag}</Text>
              </View>
            ))}
          </ScrollView>
          {/* <View style={{}}>
            <Text style={{marginLeft: 25, fontSize: 20}}>Review</Text>
          </View> */}

          <ScrollView
            vertical
            showsVerticalScrollIndicator={false}
            style={{ maxWidth: '100%', maxHeight: 300, marginBottom: 50 }}
            contentContainerStyle={{ minHeight: 100, justifyContent: 'center', alignItems: 'center' }}
          >
            <View>
              {talent.reviews.map((review, index) => (
                <View style={{ width: 360, height: 40, borderBottomColor: 'lightgrey', borderBottomWidth: 1, marginVertical: 5, flexDirection: 'column' }} key={index}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{fontSize: 12, color: 'grey'}}>{review.reviewerName}</Text>
                    
                    <Text style={{fontSize: 12, color: 'grey'}}>{review.rating}/5 <Ionicons name="star" size={13} color={"#85803a"} style={{ left: 19 }}></Ionicons></Text>
                  </View>

                  <Text style={{fontSize: 12, color: 'grey'}}>{review.message}</Text>

                </View>
              ))}
            </View>
          </ScrollView>


          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginRight: 50,
            }}
          >
            <TouchableOpacity onPress={() => handleToChatRoom(chatData)} style={styles.chatButton}>
              <Ionicons
                name="chatbubbles-outline"
                color="white"
                size={23}
              ></Ionicons>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Booking", talentId)} style={styles.bookingButton}>
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
    // height: 630,
    height: 620,
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
    width: 240,
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
