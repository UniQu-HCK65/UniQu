import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Button,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import RatingModal from "../components/modalRating";
import { useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { launchImageLibraryAsync } from "expo-image-picker";
import { LoginContext } from "../context/LoginContext";

const serverURL = "https://uniqu-chat-server.rprakoso.my.id";

const socket = io(serverURL);

export default function Chat({ route, navigation }) {
  const { isLoggedIn } = useContext(LoginContext);

  const role = isLoggedIn.role;

  const [room, setRoom] = useState("");
  const scrollViewRef = useRef(null);
  const [messageInput, setMessageInput] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [chats, setChats] = useState([]);
  const roomName = route.params.roomName;

  // console.log(
  //   route.params,
  //   "111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111"
  // );
  let accountName = "User";
  let imgUrl = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  if (role === "talent") {
    accountName = route.params.talentLoggedInName;
    imgUrl = route.params.talentLoggedInImgUrl;
  } else if (role === "user") {
    accountName = route.params.userLoggedInName;
  }

  function handleRoom(roomName) {
    setRoom(roomName);
    socket.emit("join-room", roomName);
  }

  const handleSendMessage = () => {
    if (messageInput.trim() !== "" || imageUri) {
      const messageData = {
        username: accountName,
        message: messageInput,
        imageUrl: imageUri,
        room,
      };

      socket.emit("send-message", messageData);
      setMessageInput("");
      setImageUri(null);
    }
  };

  const handleImageUpload = async () => {
    try {
      let result = await launchImageLibraryAsync({
        mediaTypes: "Images",
        allowsEditing: true,
        aspect: [9, 16],
        quality: 1,
      });

      if (!result.canceled) {
        // Now, upload the image to Cloudinary
        const formData = new FormData();
        formData.append("image", {
          uri: result.assets[0].uri,
          type: "image/jpeg",
          name: "myImage.jpg",
        });

        const response = await fetch(`${serverURL}/upload`, {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const data = await response.json();

        // Use the Cloudinary URL from the response
        setImageUri(data.imageUrl);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleRatingSubmit = () => {
    // Handle submission logic here
    // console.log("Rating submitted");
    closeModal(); // Close the modal after submission
  };

  const scrollToNewChat = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  useEffect(() => {
    handleRoom(route.params.roomName);

    socket.on("new-message", (newChat) => {
      setChats((prevChats) => [...prevChats, newChat]);
    });

    const fetchMessages = async () => {
      try {
        const response = await fetch(`${serverURL}/get-messages?room=${room}`);
        const data = await response.json();
        console.log(data, "aaaaaaa");
        setChats(data.messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    return () => {
      // Clean up socket subscriptions
      socket.off("new-message");
    };
  }, [room]);

  // console.log(modalVisible);

  return (
    <View style={styles.container}>
      <View style={{ borderBottomColor: "grey", borderBottomWidth: 0.5 }}>
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 30,
            marginTop: 60,
            gap: 10,
            marginBottom: 15,
          }}
        >
          <TouchableOpacity
            style={{ backgroundColor: "white", flexDirection: "row", gap: 10 }}
          >
            <Image
              source={{
                uri: imgUrl,
              }}
              style={styles.avatarHeader}
            />

            <View style={{ justifyContent: "center" }}>
              <Text style={{ fontWeight: "bold" }}>{accountName}</Text>
              <Text style={{ color: "gray" }}>Online</Text>
              {/* <Text style={{ fontSize: 16 }}>Current Room: {room}</Text> */}
            </View>
          </TouchableOpacity>
        </View>
      </View>
      {/* <Button title="Buka Modal Rating" onPress={openModal} /> */}
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ marginTop: 10, marginBottom: 10 }}
      >
        {chats.map((el, index) => (
          <View key={index}>
            {el.imageUrl && (
              <Image
                source={{ uri: el.imageUrl }}
                style={{
                  width: 200,
                  height: 200,
                  borderRadius: 8,
                  marginBottom: 5,
                }}
              />
            )}
            <View
              style={{
                alignSelf:
                  el.username === accountName ? "flex-end" : "flex-start",
                backgroundColor:
                  el.username === accountName ? "#ADD8E6" : "#eeeeee",
                padding: 10,
                borderRadius: 8,
                marginTop: 5,
                marginBottom: 5,
                maxWidth: "70%",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: el.username === accountName ? "white" : "black",
                }}
              >
                {el.username}: {el.message}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <RatingModal
        isVisible={modalVisible}
        onClose={closeModal}
        onSubmit={handleRatingSubmit}
      />

      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          borderTopColor: "grey",
          borderTopWidth: 0.5,
          height: 130,
        }}
      >
        <View style={styles.messageContainer}>
          <TouchableOpacity onPress={handleImageUpload}>
            <Ionicons name="attach" size={29} style={styles.attachButton} />
          </TouchableOpacity>
          <TextInput
            placeholder="Message..."
            value={messageInput}
            onChangeText={(text) => setMessageInput(text)}
            style={styles.inputField}
          />
          <TouchableOpacity onPress={handleSendMessage}>
            <Ionicons name="send" size={25} style={styles.sendButton} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "space-between",
  },
  avatarHeader: {
    width: 45,
    height: 45,
    borderRadius: 50,
  },
  messageContainer: {
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginBottom: 40,
  },
  inputField: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 50,
    width: "70%",
    marginBottom: 20,
  },
  sendButton: {
    marginBottom: 20,
  },
  attachButton: {
    marginBottom: 20,
  },
});
