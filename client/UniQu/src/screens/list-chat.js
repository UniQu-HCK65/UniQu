import React, { useContext, useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useQuery } from "@apollo/client";
import { GET_USER_CHATLIST, GET_TALENT_CHATLIST } from "../queries/query";
import { LoginContext } from "../context/LoginContext";

export default function ListChat({ navigation }) {
  // console.log(isLoggedIn, "AAAAAAAA")
  const [chatList, setChatList] = useState([]);
  const { isLoggedIn } = useContext(LoginContext);
  const {
    loading: loadingUser,
    error: errorUser,
    data: dataUserChatlist,
  } = useQuery(GET_USER_CHATLIST);
  const {
    loading: loadingTalent,
    error: errorTalent,
    data: dataTalentCahtlist,
  } = useQuery(GET_TALENT_CHATLIST);

  const userLoggedInId = dataUserChatlist?.getUserChatlist?._id;
  const talentLoggedInId = dataTalentCahtlist?.getTalentChatlist?._id;

  let roomName1 = "0";
  let roomName2 = "0";

  const handleToChatRoom = (IdTarget) => {
    // console.log(IdTarget, "clicked");
    // console.log("chat room pressed");
    if (isLoggedIn.role === "user") {
      roomName1 = userLoggedInId;
      roomName2 = IdTarget;
    } else if (isLoggedIn.role === "talent") {
      roomName1 = IdTarget;
      roomName2 = talentLoggedInId;
    }

    navigation.navigate("Chat", {
      // roomName: `123`,
      roomName: `${roomName1}-${roomName2}`,
      userLoggedInName: dataUserChatlist?.getUserChatlist?.name,
      userLoggedInImgUrl: dataUserChatlist?.getUserChatlist?.imgUrl,
      talentLoggedInName: dataTalentCahtlist?.getTalentChatlist?.name,
      talentLoggedInImgUrl: dataTalentCahtlist?.getTalentChatlist?.imgUrl,
    });
  };

  useEffect(() => {
    if (isLoggedIn.role === "user") {
      setChatList(dataUserChatlist?.getUserChatlist?.chatList);
    } else if (isLoggedIn.role === "talent") {
      setChatList(dataTalentCahtlist?.getTalentChatlist?.chatList);
    }
  }, [chatList, dataTalentCahtlist, dataUserChatlist, isLoggedIn.role]);

  console.log(dataUserChatlist?.getUserChatlist?.imgUrl, "CHATLIST");
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Message</Text>
      </View>

      {chatList?.map((person) => {
        // console.log(person, "SSSS");
        return (
          <TouchableOpacity
            onPress={() => handleToChatRoom(person.TalentId || person.UserId)}
            style={styles.chatCard}
          >
            <View style={styles.cardContent}>
              <Image
                source={{
                  uri: person.talentImgUrl || person.userImgUrl,
                }}
                style={styles.avatar}
              />
              <View style={styles.textContainer}>
                <Text style={styles.name}>
                  {person.talentName || person.userName}
                </Text>
                <Text style={styles.message}>
                  {person.talentNick || person.userNick}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
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
