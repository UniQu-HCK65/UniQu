import * as SecureStore from "expo-secure-store";
import React, { useContext, useEffect, useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useMutation, gql } from "@apollo/client";
import { LoginContext } from "../context/LoginContext";
import { GET_USER } from "../queries/query";

async function save(key, value) {
  await SecureStore.setItemAsync(key, value);
}

const LOGIN = gql`
  mutation Login($email: String, $password: String) {
    login(email: $email, password: $password) {
      access_token
      role
    }
  }
`;

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("nell@mail.com");
  const [password, setPassword] = useState("12345");

  const { setIsLoggedIn } = useContext(LoginContext);

  const [handleLogin, { loading, error, data }] = useMutation(LOGIN, {
    refetchQueries: [GET_USER],
  });

  // const handleSubmit = async () => {
  //   const { data } = await handleLogin({
  //     variables: {
  //       email,
  //       password,
  //     },
  //     onCompleted: async (data) => {
  //       // setIsLoggedIn(data.login.access_token)
  //       setIsLoggedIn({
  //           accessToken: data.login.access_token,
  //           role: data.login.role
  //       })
  //       // setIsLoggedIn(data.login.role)
  //       await save('accessToken', data.login.access_token)
  //       await save('role', data.login.role)
  //   },
  //     onError: (error) => {
  //       console.log(error);
  //     },
  //   });
  //   // console.log(data, ">> datalogin");
  //   if (data) {
  //     setIsLoggedIn(data.login.access_token);
  //     await save("accessToken", data.login.access_token);
  //   }
  // };
  const handleSubmit = () => {
    handleLogin({
        variables: {
            email,
            password
        },
        onCompleted: async (data) => {
            // setIsLoggedIn(data.login.access_token)
            setIsLoggedIn({
                accessToken: data.login.access_token,
                role: data.login.role
            })
            // setIsLoggedIn(data.login.role)
            await save('accessToken', data.login.access_token)
            await save('role', data.login.role)
        },
        onError: (error) => {
            console.log(error)
        }
    })
}

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.header}>
          <Image
            source={require("../../assets/logo_black.png")}
            style={{ width: 550, height: 50 }}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="email"
            name="email"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="password"
            name="password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />
        </View>
        <TouchableOpacity onPress={handleSubmit} style={styles.buttonLogin}>
          <Text style={{ color: "white" }}>Login</Text>
        </TouchableOpacity>
        <View style={styles.buttonRegister}>
          <Text style={{ color: "black" }}>Don't have an account ?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={{ color: "blue" }}>Register</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },

  header: {
    alignItems: "center",
    marginBottom: 30,
  },

  title: {
    fontSize: 23,
    fontWeight: "bold",
  },

  inputContainer: {
    marginBottom: 20,
  },

  input: {
    width: 250,
    borderRadius: 30,
    backgroundColor: "#f1f1f1",
    marginBottom: 5,
    marginTop: 5,
    padding: 20,
  },

  image: {
    width: 10,
    height: 10,
  },

  buttonLogin: {
    backgroundColor: "black",
    borderRadius: 25,
    width: 150,
    height: 43,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonRegister: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
  },
});
