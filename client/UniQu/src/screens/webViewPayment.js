import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";

const MyWebComponent = ({ url, handleWebViewNavigationStateChange }) => {
  console.log(url)
  return (
    <WebView
      ref={(ref) => (this.webview = ref)}
      source={{ uri: `${url}` }} style={{ flex: 1 }}
      onNavigationStateChange={handleWebViewNavigationStateChange}
    />
  );
};

export default function WebViewPayment({ navigation, route }) {
  const url = route.params.url
  console.log(url, "AAAAAAA")
  const bookingId = route.params.bookingId
  const handleWebViewNavigationStateChange = (newNavState) => {
    console.log(newNavState, "GAMASUK SINI???")
    const { url } = newNavState;
    if (!url) return;


    if (url.includes('unsplash')) {
      navigation.navigate("Status Booking", { bookingId: bookingId })
      // open a modal with the PDF viewer
    }

  }
  return (
    <View style={{ flex: 1 }}>
      <MyWebComponent handleWebViewNavigationStateChange={handleWebViewNavigationStateChange} url={url} />
    </View>
  );
}


// import { WebView } from "react-native-webview";
// import React from "react";
// import { View } from "react-native";

// const MyWebComponent = ({ url, handleWebViewNavigationStateChange }) => {
//   return (
//     <WebView
//       ref={(ref) => (this.webview = ref)}
//       source={{ uri: `${url}` }}
//       style={{ flex: 1 }}
//       onNavigationStateChange={handleWebViewNavigationStateChange(navState)}
//     />
//   );
// };

// export default function WebViewPayment({ navigation, route }) {
//   const url = route.params.url;
//   const bookingId = route.params.bookingId;

//   const handleWebViewNavigationStateChange = (navState) => {
//     // Check if the URL has changed and navigate accordingly
//     if (navState.url !== url) {
//       navigation.navigate("Status Booking", { bookingId: bookingId });
//     }
//   };

//   return (
//     <View style={{ flex: 1 }}>
//       <MyWebComponent
//         handleWebViewNavigationStateChange={handleWebViewNavigationStateChange}
//         url={url}
//       />
//     </View>
//   );
// }
