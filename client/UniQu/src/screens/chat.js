import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Button,
  ScrollView
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import RatingModal from "../components/modalRating";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const serverURL = "http://192.168.68.168:4000";
const socket = io(serverURL);

export default function Chat({ route, navigation }) {
  const [room, setRoom] = useState("");
  const scrollViewRef = useRef(null);
  const [messageInput, setMessageInput] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [chats, setChats] = useState([]);
  const roomName = route.params.roomName;
  const userLoggedInName = route.params.userLoggedInName;
  console.log(route.params, "<<<<<<<<<<username>>>>>>>>>>");

  function handleRoom(roomName) {
    setRoom(roomName);
    socket.emit("join-room", roomName);
  }

  const handleSendMessage = () => {
    if (messageInput.trim() !== "" || imageUri) {
      const messageData = {
        username: userLoggedInName,
        message: messageInput,
        imageUrl: imageUri,
        room,
      };

      socket.emit("send-message", messageData);
      setMessageInput("");
      setImageUri(null);
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
    console.log("Rating submitted");
    closeModal(); // Close the modal after submission
  };

  const scrollToNewChat = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

//   useEffect(() => {
//     handleRoom(roomName);

//     socket.on("new-message", (newChat) => {
//       setChats((prevChats) => [...prevChats, newChat]);
//     });
//   });

//   useEffect(() => {
//     scrollToNewChat();

//     const fetchMessages = async () => {
//       try {
//         const response = await fetch(`${serverURL}/get-messages?room=${room}`);
//         const data = await response.json();
//         setChats(data.messages);
//       } catch (error) {
//         console.error("Error fetching messages:", error);
//       }
//     };

//     fetchMessages();
//   }, [chats, room]);



useEffect(() => {
    handleRoom(roomName);
  
    socket.on("new-message", (newChat) => {
      setChats((prevChats) => [...prevChats, newChat]);
    });
  
    const fetchMessages = async () => {
      try {
        const response = await fetch(`${serverURL}/get-messages?room=${room}`);
        const data = await response.json();
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

      
  }, [room]); // Only depend on 'room' in the dependency array
  




  console.log(modalVisible);

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
                uri: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
              }}
              style={styles.avatarHeader}
            />

            <View style={{ justifyContent: "center" }}>
              <Text style={{ fontWeight: "bold" }}>Maldini Junior</Text>
              <Text style={{ color: "gray" }}>Online</Text>
              <Text style={{ fontSize: 16 }}>Current Room: {room}</Text>
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
                alignSelf: el.username === userLoggedInName ? "flex-end" : "flex-start",
                backgroundColor: el.username === userLoggedInName ? "#ADD8E6" : "white",
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
                  color: el.username === userLoggedInName ? "white" : "black",
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
          <Ionicons name="attach" size={29} style={styles.attachButton} />
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
