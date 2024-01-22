import React from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import { Video } from 'expo-av';
import Ionicons from 'react-native-vector-icons/Entypo'
import AntDesign from 'react-native-vector-icons/AntDesign'

export default function LandingPage({ navigation }) {
    return (
        <View style={styles.container}>
            <View style={styles.backgroundContainer}>
                <Video
                    source={{ uri: 'https://v1.pinimg.com/videos/mc/720p/e1/81/7d/e1817d58749dedb8152a02e701e102c0.mp4' }}
                    resizeMode="cover"
                    isLooping
                    shouldPlay
                    style={styles.backgroundVideo}
                /> 
            </View>

            <View style={styles.overlay}></View>

            <View style={styles.bottom}></View>


            <View style={styles.cardContainer}>
                <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Login')}>
                    <Ionicons name="login" size={20} style={{ color: 'white' }} ></Ionicons>
                    <Text style={{ fontSize: 13, fontWeight: 'bold', color: 'white' }}>Sign In</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Register')}>
                    <AntDesign name="adduser" size={20} style={{ color: 'white' }} ></AntDesign>
                    <Text style={{ fontSize: 13, fontWeight: 'bold', color: 'white' }}>Register</Text>
                </TouchableOpacity>

            </View>
            <View style={{ backgroundColor: 'white', width: '100%', height: 50, zIndex: 5, justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
                <Text style={{ color: 'grey' }}>Elevate Your Fashion Journey</Text>
            </View>

            <Image source={require('../../assets/logo.png')} style={styles.logo} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
    backgroundContainer: {
        flex: 1,
        zIndex: 1,
    },
    backgroundVideo: {
        flex: 1,
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
    logo: {
        marginTop: 380,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        marginLeft: -58,
        zIndex: 4,
    },
    cardContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        position: 'absolute',
        bottom: 80,
        left: 10,
        right: 10,
        zIndex: 5,
        marginTop: 10
    },
    card: {
        backgroundColor: 'black',
        shadowColor: 'black',
        // shadowOffset: 1,
        // shadowOpacity: 1,
        height: 50,
        width: 170,
        borderColor: 'black',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10,
    },
});
