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
} from "react-native";

export default function Home({ navigation }) {
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

      <ScrollView>
        <View style={styles.cardContainer}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
            }}
            style={styles.profileImage}
          />
          <View style={styles.profileDetails}>
            <Text style={styles.nameText}> Sera Camile </Text>
            <Text style={styles.descriptionText}>
              Hey there, fashion aficionados! 👋 Welcome to my style sanctuary,
              where every outfit tells a story and every accessory is a
              punctuation mark in the language of fashion.
            </Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>4.5</Text>
              <Text style={styles.reviewsText}>(25 Reviews)</Text>
            </View>
          </View>
        </View>

        <View style={styles.cardContainer}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
            }}
            style={styles.profileImage}
          />
          <View style={styles.profileDetails}>
            <Text style={styles.nameText}> Sera Camile </Text>
            <Text style={styles.descriptionText}>
              Hey there, fashion aficionados! 👋 Welcome to my style sanctuary,
              where every outfit tells a story and every accessory is a
              punctuation mark in the language of fashion.
            </Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>4.5</Text>
              <Text style={styles.reviewsText}>(25 Reviews)</Text>
            </View>
          </View>
        </View>

        <View style={styles.cardContainer}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
            }}
            style={styles.profileImage}
          />
          <View style={styles.profileDetails}>
            <Text style={styles.nameText}> Sera Camile </Text>
            <Text style={styles.descriptionText}>
              Hey there, fashion aficionados! 👋 Welcome to my style sanctuary,
              where every outfit tells a story and every accessory is a
              punctuation mark in the language of fashion.
            </Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>4.5</Text>
              <Text style={styles.reviewsText}>(25 Reviews)</Text>
            </View>
          </View>
        </View>

        <View style={styles.cardContainer}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
            }}
            style={styles.profileImage}
          />
          <View style={styles.profileDetails}>
            <Text style={styles.nameText}> Sera Camile </Text>
            <Text style={styles.descriptionText}>
              Hey there, fashion aficionados! 👋 Welcome to my style sanctuary,
              where every outfit tells a story and every accessory is a
              punctuation mark in the language of fashion.
            </Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>4.5</Text>
              <Text style={styles.reviewsText}>(25 Reviews)</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <Button
        title="Go to Login"
        onPress={() => navigation.navigate("Login")}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollViewContent: {
    // alignItems: "top",
    alignItems: "flex-start",
    gap: -8,
    justifyContent: "center",
    marginVertical: 10,
  },
  categoryCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    margin: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    // shadowRadius: 4,
    elevation: 5,
  },
  categoryText: {
    fontSize: 20,
    fontWeight: "bold",
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
    flex: 1,
    marginLeft: 20,
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
  },
});
