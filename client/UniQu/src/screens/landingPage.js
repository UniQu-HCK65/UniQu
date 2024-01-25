import React from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import { Video } from 'expo-av';
import Ionicons from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function LandingPage({ navigation }) {
  return (
    <View style={styles.container}>
      <Video
        source={{ uri: 'https://v1.pinimg.com/videos/mc/720p/e1/81/7d/e1817d58749dedb8152a02e701e102c0.mp4' }}
        resizeMode="cover"
        isLooping
        shouldPlay
        style={styles.backgroundVideo}
      />

      <View style={styles.overlay}></View>

      <View style={styles.bottom}></View>

      <View style={styles.logoContainer}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
      </View>

      <View style={styles.cardContainer}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Login')}>
          <Ionicons name="login" size={20} style={{ color: 'white' }} />
          <Text style={styles.cardText}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Register')}>
          <AntDesign name="adduser" size={20} style={{ color: 'white' }} />
          <Text style={styles.cardText}>Register</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.elevateTextContainer}>
        <Text style={styles.elevateText}>Elevate Your Fashion Journey</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  backgroundVideo: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    opacity: 0.6,
    zIndex: 2,
  },
  bottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
    borderRadius: 20,
    zIndex: 3,
    backgroundColor: 'white',
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 80,
    left: 10,
    right: 10,
    zIndex: 5,
    marginTop: 10,
  },
  card: {
    backgroundColor: 'black',
    shadowColor: 'black',
    height: 50,
    width: 170,
    borderColor: 'black',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  cardText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: 'white',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 4,
    flex: 1,
  },
  logo: {
    zIndex: 4,
    marginTop: 550
  },
  elevateTextContainer: {
    backgroundColor: 'white',
    width: '100%',
    height: 50,
    zIndex: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  elevateText: {
    color: 'grey',
  },
});
