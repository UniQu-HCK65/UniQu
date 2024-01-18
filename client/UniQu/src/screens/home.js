import React from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Button,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import LogoutButton from "../components/logoutButton";
import { useQuery } from "@apollo/client";
import { FOR_YOU_TALENT_PAGE } from "../queries/query";

const tags = [
  "Sneakers",
  "Wedges",
  "Heels",
  "Purse",
  "Dress",
  "Suits",
  "Coat",
  "Scarf",
  "Winter Padding",
  "Accessories",
  "Earrings",
  "Necklace",
  "Bracelets",
  "Brooch",
  "Luis Vuitton",
  "Gucci",
  "Armani",
  "Rolex",
]

export default function Home({ navigation }) {
  const { loading, error, data } = useQuery(FOR_YOU_TALENT_PAGE);
  // console.log(data.talentsForMe, ">> homescreen");
  // console.log(loading, "loading home");

  const renderTalentForYou = () => {
    if (error) {
      return <Text>Error: {error.message}</Text>;
    }

    const talents = data.talentsForMe.talentsForMe;
    console.log(talents, ">> talents");

    return (
      <View>
        {/* <View style={styles.containerForyou}>
          <View style={styles.detailForYou}>
            <Text style={styles.textForYou}>For You</Text>

            <TouchableOpacity
              style={styles.seeAllButton}
              onPress={() => navigation.navigate("All Talent")}
            >
              <Text style={styles.textSeeAll}> See All </Text>
            </TouchableOpacity>
          </View>
        </View> */}

        {talents.map((talent) => (
          <View key={talent._id} style={styles.cardContainer}>
            <View style={styles.image}>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
                }}
                style={styles.profileImage}
              />
            </View>

            <View style={styles.detailInformasi}>
              <View style={styles.profileDetails}>
                <View style={styles.detailName}>
                  <Text style={styles.nameText}>{talent.name}</Text>
                </View>

                <View style={styles.descriptionText}>
                  <Text>{talent.aboutme}</Text>
                </View>

                <View style={styles.ratingContainer}>
                  <Text style={styles.ratingText}>{talent.rating}</Text>
                  <Text style={styles.reviewsText}>
                    ({talent.reviews}5 reviews)
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <TouchableOpacity>
          <View style={styles.categoryCard}>
            <Text style={styles.categoryText}> Clothes </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity>
          <View style={styles.categoryCard}>
            <Text style={styles.categoryText}> Shoes </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity>
          <View style={styles.categoryCard}>
            <Text style={styles.categoryText}> Accessories </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity>
          <View style={styles.categoryCard}>
            <Text style={styles.categoryText}> Luxury Brands </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.containerForyou}>
        <View style={styles.detailForYou}>
          <Text style={styles.textForYou}>For You</Text>

          <TouchableOpacity
            style={styles.seeAllButton}
            onPress={() => navigation.navigate("All Talent")}
          >
            <Text style={styles.textSeeAll}> See All </Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#5a84a5" />
      ) : (
        <FlatList
          data={data.talentsForMe.talentsForMe}
          keyExtractor={(item) => item._id}
          renderItem={renderTalentForYou}
        />
      )}

      {/* {!loading && (
        <FlatList
          data={data.talentsForMe.talentsForMe}
          keyExtractor={(item) => item._id}
          renderItem={renderTalentForYou}
        />
      )} */}
      <LogoutButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // backgroundColor: "red"
  },
  scrollViewContent: {
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 5,
    paddingHorizontal: 10,
    padding: 10
  },
  categoryCard: {
    backgroundColor: "#fff",
    alignItems: "center",
    borderRadius: 25,
    padding: 20,
    margin: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    // elevation: 5,
    height: 54,
    // backgroundColor: "red"
  },
  categoryText: {
    fontSize: 17,
    // fontWeight: "bold",
    color: "#333",
  },
  cardContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  profileDetails: {
    // flex: 1,
    // marginLeft: 20,
  },
  nameText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  descriptionText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
    // backgroundColor: "orange",
    // flexShrink: 1,
    textAlign: "justify",
    maxWidth: "100%",
  },
  ratingText: {
    fontSize: 16,
    color: "#f39c12",
  },
  reviewsText: {
    fontSize: 14,
    color: "#555",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "yellow",
  },
  image: {
    // backgroundColor: "pink",
    justifyContent: "center",
  },
  detailInformasi: {
    // backgroundColor: "pink",
    marginLeft: 15,
    width: 270,
  },
  detailName: {
    // backgroundColor: "green",
    marginBottom: 6,
    width: 270,
    // height: 50
  },
  containerForyou: {
    // backgroundColor: "yellow",
    marginLeft: 15,
    marginRight: 15,
  },
  seeAllButton: {
    alignSelf: "flex-end",
  },
  detailForYou: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
    // backgroundColor: "red"
  },
  textForYou: {
    fontSize: 27,
    fontWeight: "bold",
    fontFamily: "",
  },
  textSeeAll: {
    fontSize: 18,
    color: "#5a84a5",
  },
});
