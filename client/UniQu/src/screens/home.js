import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
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
  GET_BOOKING_BY_ID,
  GET_USER,
  SEARCH_TALENT,
} from "../queries/query";
import Ionicons from "react-native-vector-icons/Feather";
import RatingModal from "../components/modalRating";

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
    role
    gender
    imgUrl
    tags
    reviews {
      BookingId
      message
      reviewerName
      rating
      updatedAt
      createdAt
    }
    rating
    talentLocations
    balance
    updatedAt
    createdAt
  }
}
`;

export default function Home({ navigation }) {
  const [allTalents, setAllTalents] = useState([]);
  const [talentsForYou, setTalentsForYou] = useState([]);
  const [selectedDataType, setSelectedDataType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [bookingId, setBookingId] = useState(null);

  const {
    loading: searchLoading,
    error: searchError,
    data: searchData,
    refetch: refetchSearch,
  } = useQuery(SEARCH_TALENT, {
    variables: {
      searchParam: {
        name: search,
        username: search,
      },
    },
    skip: !search,
  });

  // update search

  const handleSearch = async () => {
    // console.log(search, "<< bfr search");
    // await refetchSearch();
    if (searchData && searchData.searchTalent) {
      setAllTalents(searchData.searchTalent);
    }
    // console.log(searchData, "<< aft search");

    // setAllTalents(searchData.searchTalent);
  };

  const {
    loading: forYouLoading,
    error: forYouError,
    data: forYouData,
    refetch: refetchForYou,
  } = useQuery(FOR_YOU_TALENT_PAGE);
  const {
    data: nameUserData,
    loading: getUserLoading,
    error: getUserError,
    refetch: refetchGetUser,
  } = useQuery(GET_USER);
  const nameUser = nameUserData?.whoAmI?.name;
  const photoUser = nameUserData?.whoAmI?.imgUrl;

  const {
    loading: allTalentLoading,
    error: allTalentError,
    data: allTalentData,
    refetch: refetchAllTalent,
  } = useQuery(ALL_TALENT);

  const handleSeeAll = async () => {
    setSelectedDataType("all");
    await refetchAllTalent();
    setAllTalents(allTalentData.talents);
  };

  const handleForYou = async () => {
    setSelectedDataType("forYou");
    await refetchForYou();
    setTalentsForYou(forYouData.talentsForMe.talentsForMe);
  };

  useEffect(() => {
    refetchGetUser();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [search]);

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
    refetchForYou,
    refetchAllTalent,
    refetchGetUser,
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
    // console.log(JSON.stringify(item, null, 2), "item");
    if (forYouError || allTalentError) {
      return <Text>Error: {error.message}</Text>;
    }

    const totalReviewers = new Set();
    if (item.reviews && Array.isArray(item.reviews)) {
      item.reviews.forEach((review) => totalReviewers.add(review.reviewerName));
    }

    return (
      <TouchableOpacity
        style={styles.containerHeader}
        onPress={() => {
          navigation.navigate("TalentDetails", { talentId: item._id });
          console.log(item._id, "kelikkk ditel");
        }}
      >
        <View key={item._id} style={styles.cardContainer}>
          <View style={styles.image}>
            <Image
              source={{
                uri: item.imgUrl,
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
                <Text style={styles.ratingText}>
                  {(item.rating / item.reviews?.length).toFixed(1)}
                </Text>
                <Text style={styles.reviewsText}>
                  ({totalReviewers.size} reviews)
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={{}}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1627163439134-7a8c47e08208?q=80&w=3432&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          }}
          style={styles.imageHeader}
        />
        <View style={styles.overlay}></View>

        <View style={styles.contentHeader}>
          <View style={styles.containerHeader}>
            <Text style={styles.textNameHeader}>
              Hai, {getUserLoading ? " " : nameUser}{" "}
            </Text>
            <Text style={styles.textWelcomingHeader}>
              Welcome back, What are you looking for today?
            </Text>
          </View>

          <View style={{}}>
            <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
              <Image
                source={{
                  uri: photoUser,
                }}
                style={styles.avatarHeader}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchContainerText}>
            <TextInput
              placeholder="Search"
              value={search}
              onChangeText={(text) => setSearch(text)}
              style={styles.textInputSearch}
            />
            <TouchableOpacity onPress={handleSearch}>
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
          // data={!dataRender ? forYouData.talentsForMe.talentsForMe : dataRender}
          data={
            !dataRender
              ? forYouData.talentsForMe.talentsForMe
              : dataRender.filter(
                (talent) =>
                  talent.name.toLowerCase().includes(search.toLowerCase()) ||
                  talent.username.toLowerCase().includes(search.toLowerCase())
              )
          }
          keyExtractor={(item) => item._id}
          renderItem={renderTalentForYou}
        />
      )}
    </View>
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
    marginLeft: 3,
  },
  profileImage: {
    width: 75,
    height: 75,
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
    marginTop: 40,
  },
  textNameHeader: {
    fontWeight: "bold",
    fontSize: 26,
    marginTop: 10,
    color: "white",
  },
  textWelcomingHeader: {
    fontWeight: "bold",
    fontSize: 15,
    marginTop: 10,
    width: 300,
    color: "white",
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
  imageHeader: {
    width: "100%",
    height: 130,
    resizeMode: "cover",
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    zIndex: -1,
    position: "absolute",
    opacity: 50,
    height: 180,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "black",
    opacity: 0.5,
    width: "100%",
    height: 180,
    borderBottomEndRadius: 50,
    borderBottomStartRadius: 50,
  },
});
