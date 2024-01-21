import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Input, Button } from "react-native-elements";
import { io } from "socket.io-client";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/FontAwesome";

const serverURL = "http://192.168.68.168:4000";
const socket = io(serverURL);

export default function Chat() {
  const scrollViewRef = useRef(null);
  const [userName, setUserName] = useState(null);
  const [chats, setChats] = useState([]);
  const [room, setRoom] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [usernameInput, setUsernameInput] = useState("");
  const [isInRoom, setIsInRoom] = useState(false);
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    scrollToNewChat();

    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `${serverURL}/get-messages?room=${room}`
        );
        const data = await response.json();
        setChats(data.messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [chats, room]);

  const handleSendMessage = () => {
    if ((messageInput.trim() !== "" || imageUri) && isInRoom) {
      const messageData = {
        username: userName,
        message: messageInput,
        imageUrl: imageUri,
        room,
      };

      socket.emit("send-message", messageData);
      setMessageInput("");
      setImageUri(null);
    }
  };

  const handleUsername = (username) => {
    setUserName(username);
    socket.emit("set-username", username);
  };

  const handleRoom = (newRoom) => {
    setRoom(newRoom);
    socket.emit("join-room", newRoom);
    setIsInRoom(true);
  };

  const scrollToNewChat = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  const handleImageUpload = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [10, 21],
        quality: 1,
      });
  
      if (!result.canceled) {
        const formData = new FormData();
        formData.append("image", {
          uri: result.uri,
          type: "image/jpeg",
          name: "image.jpg",
        });
        formData.append("message", messageInput);
  
        fetch(`${serverURL}/upload`, {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
          })
          .catch((error) => {
            console.error("Error uploading image:", error);
          });
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log(socket.id);
      setOnlineUsers((prevUsers) => [...prevUsers, socket.id]);
    });

    socket.on("new-message", (newChat) => {
      setChats((prevChats) => [...prevChats, newChat]);
    });

    socket.on("new-user", (user) => console.log(`new-user: ${user}`));

    socket.on("room-change", (data) => {
      console.log(`${data.username} changed to room ${data.room}`);
    });

    return () => {
      socket.off("connect");
      socket.off("new-message");
      socket.off("new-user");
      socket.off("join-room");
    };
  }, []);

  return (
    <View style={{ flex: 1, padding: 10 }}>
      {!!userName ? (
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              {userName}
            </Text>
            <Text style={{ fontSize: 16 }}>Current Room: {room}</Text>
          </View>
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
                      el.username === userName ? "flex-end" : "flex-start",
                    backgroundColor:
                      el.username === userName ? "#ADD8E6" : "white",
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
                      color:
                        el.username === userName ? "white" : "black",
                    }}
                  >
                    {el.username}: {el.message}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginRight: 30,
            }}
          >
            <Input
              placeholder="Message"
              value={messageInput}
              onChangeText={(text) => setMessageInput(text)}
              style={{ flex: 1, width: 10 }}
            />
            <TouchableOpacity onPress={handleSendMessage}>
              <Icon
                name="send"
                type="material"
                style={{ marginRight: 50, padding: 5 }}
                size={25}
                color={isInRoom ? "black" : "gray"}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={handleImageUpload}>
            <Icon
              name="image"
              type="material"
              style={{ marginRight: 10, padding: 5 }}
              size={25}
              color="gray"
            />
          </TouchableOpacity>
          <Input
            placeholder="Room"
            onChangeText={(text) => handleRoom(text)}
            style={{ marginBottom: 10 }}
          />
          <Button title="Change Room" onPress={() => handleRoom(room)} />
        </View>
      ) : (
        <View style={{ padding: 10 }}>
          <Input
            placeholder="Username"
            value={usernameInput}
            onChangeText={(text) => setUsernameInput(text)}
            containerStyle={{ marginBottom: 10 }}
          />
          <Button
            title="Set Username"
            onPress={() => handleUsername(usernameInput)}
          />
        </View>
      )}
    </View>
  );
}
