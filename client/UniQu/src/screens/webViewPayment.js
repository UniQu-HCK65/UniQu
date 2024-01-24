import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";

const MyWebComponent = ({ url }) => {
  console.log(url)
  return (
    <WebView
      ref={(ref) => (this.webview = ref)}
      source={{ uri: `${url}` }} style={{ flex: 1 }}
      onNavigationStateChange={this.handleWebViewNavigationStateChange}
    />
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
