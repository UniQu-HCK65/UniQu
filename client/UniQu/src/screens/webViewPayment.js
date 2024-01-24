import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";

const MyWebComponent = ({url}) => {
  console.log(url)
  return (
    <WebView source={{ uri: `${url}` }} style={{ flex: 1 }} />
  );
};

export default function WebViewPayment({ navigation, route }) {
  const url = route.params.url
  return (
    <View style={{ flex: 1 }}>
      <MyWebComponent url={url} />
    </View>
  );
}
