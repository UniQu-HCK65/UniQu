import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  ImageBackground,
  Button,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  TextInput,
} from "react-native";
import LogoutButton from "../components/logoutButton";
import { gql, useQuery } from "@apollo/client";
import {
  FOR_YOU_TALENT_PAGE,
  GET_ALL_TALENT,
  GET_USER,
} from "../queries/query";
import Ionicons from "react-native-vector-icons/Feather";

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
];

const ALL_TALENT = gql`
  query Talents {
    talents {
      _id
      name
      username
      email
      password
      aboutme
      gender
      tags
      talentLocations
      balance
    }
  }
`;

export default function Home({ navigation }) {
  const [allTalents, setAllTalents] = useState([]);
  const [talentsForYou, setTalentsForYou] = useState([]);
  const [selectedDataType, setSelectedDataType] = useState("all");
  const [loading, setLoading] = useState(true);

  const {
    loading: forYouLoading,
    error: forYouError,
    data: forYouData,
  } = useQuery(FOR_YOU_TALENT_PAGE);
  const { data: nameUserData } = useQuery(GET_USER);
  const nameUser = nameUserData?.whoAmI?.name;
  const {
    loading: allTalentLoading,
    error: allTalentError,
    data: allTalentData,
  } = useQuery(ALL_TALENT);

  const handleSeeAll = () => {
    setSelectedDataType("all");
    setAllTalents(allTalentData.talents);
  };

  const handleForYou = () => {
    setSelectedDataType("forYou");
    setTalentsForYou(forYouData.talentsForMe.talentsForMe);
  };

  useEffect(() => {
    if (!forYouLoading && !allTalentLoading) {
      setLoading(false);
    }

    if (selectedDataType === "forYou" && talentsForYou.length === 0) {
      handleForYou();
    }
  }, [
    forYouLoading,
    allTalentLoading,
    forYouData,
    talentsForYou,
    selectedDataType,
  ]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (forYouError) {
    return <Text>Error fetching FOR_YOU_TALENT_PAGE data</Text>;
  }

  if (allTalentError) {
    return <Text>Error fetching ALL_TALENT data</Text>;
  }

  let dataRender;

  if (
    selectedDataType === "all" &&
    Array.isArray(allTalents) &&
    allTalents.length > 0
  ) {
    dataRender = allTalents;
  } else if (
    selectedDataType === "forYou" &&
    Array.isArray(talentsForYou) &&
    talentsForYou.length > 0
  ) {
    dataRender = talentsForYou;
  }

  // console.log(dataRender, '<<<<')
  // console.log(talentsForYou)

  const renderTalentForYou = ({ item }) => {
    if (forYouError || allTalentError) {
      return <Text>Error: {error.message}</Text>;
    }

    return (
      <View style={styles.containerHeader}>
        <View key={item._id} style={styles.cardContainer}>
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
                <Text style={styles.nameText}>{item.name}</Text>
              </View>

              <View style={styles.descriptionText}>
                <Text>{item.aboutme}</Text>
              </View>

              <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>{item.rating}</Text>
                <Text style={styles.reviewsText}>
                  ({item.reviews}5 reviews)
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{}}>
        {/* <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1642439048934-27a82f89b866?q=80&w=3328&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          }}
          style={{ width: '100%', height: 130, resizeMode: 'cover', borderBottomLeftRadius: 70, borderBottomRightRadius: 70, zIndex: -1, position:'absolute', opacity: 40}}
        /> */}
        <View style={styles.contentHeader}>
          <View style={styles.containerHeader}>
            <Text style={styles.textNameHeader}>Hai, {nameUser}</Text>
            <Text style={styles.textWelcomingHeader}>
              Welcome back, What are you looking for today?
            </Text>
          </View>

          <View style={{}}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
              }}
              style={styles.avatarHeader}
            />
          </View>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchContainerText}>
            <TextInput placeholder="Search" style={styles.textInputSearch} />
            <TouchableOpacity onPress={() => navigation.navigate("All Talent")}>
              <Ionicons name="search" size={20} style={{ marginRight: 10 }} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.containerForyou}>
        <View style={styles.detailForYou}>
          <View
            style={{ height: 40, borderColor: "black", borderWidth: 2 }}
          ></View>

          <TouchableOpacity onPress={handleForYou}>
            <Text style={styles.textForYou}>For You</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSeeAll}>
            <Text style={styles.textSeeAll}> See All </Text>
          </TouchableOpacity>
        </View>
      </View>

      {forYouLoading || allTalentLoading ? (
        <ActivityIndicator size="large" color="#5a84a5" />
      ) : (
        <FlatList
          data={!dataRender ? forYouData.talentsForMe.talentsForMe : dataRender}
          keyExtractor={(item) => item._id}
          renderItem={renderTalentForYou}
        />
      )}

      <LogoutButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollViewContent: {
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 5,
    paddingHorizontal: 10,
    padding: 10,
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
    height: 54,
  },
  categoryText: {
    fontSize: 17,
    color: "#333",
  },
  cardContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  nameText: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 5,
  },
  descriptionText: {
    marginRight: 10,
    fontSize: 10,
    color: "#666",
    marginBottom: 10,
    textAlign: "justify",
    maxWidth: "100%",
  },
  ratingText: {
    fontSize: 12,
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
  },
  image: {
    justifyContent: "center",
  },
  detailInformasi: {
    padding: 10,
    width: 270,
  },
  detailName: {
    marginBottom: 6,
    width: 270,
  },
  containerForyou: {
    marginHorizontal: 20,
    marginTop: 15,
  },
  seeAllButton: {
    alignSelf: "flex-end",
  },
  detailForYou: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  textForYou: {
    fontSize: 20,
    fontWeight: "bold",
    right: 100,
  },
  textSeeAll: {
    fontSize: 18,
    color: "#5a84a5",
  },
  containerHeader: {
    marginHorizontal: 20,
    marginTop: 10,
  },
  contentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: 15,
    marginBottom: 10,
    zIndex: 5,
  },
  textNameHeader: {
    fontWeight: "bold",
    fontSize: 26,
    marginTop: 10,
  },
  textWelcomingHeader: {
    fontWeight: "bold",
    fontSize: 15,
    marginTop: 10,
    width: 300,
  },
  avatarHeader: {
    width: 45,
    height: 45,
    borderRadius: 100,
    marginTop: 10,
    right: 10,
  },
  searchContainer: {
    marginHorizontal: 20,
    marginTop: 5,
    marginBottom: 5,
    flexDirection: "row",
    alignItems: "center",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  searchContainerText: {
    flex: 1,
    flexDirection: "row",
    height: 40,
    backgroundColor: "white",
    borderRadius: 15,
    alignItems: "center",
  },
  textInputSearch: {
    flex: 1,
    height: 35,
    marginHorizontal: 20,
  },
});
