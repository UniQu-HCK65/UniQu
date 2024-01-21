import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ListBookingTalent() {
    const [status, setStatus] = useState('');

    const handleOnAccept = () => {
        setStatus('booked')
    }

    const handleOnCancel = () => {
        setStatus('cancel')
    }


    return (
        <View style={styles.container}>

            <View style={styles.overlayContainer}>
                <Image
                    source={{
                        uri: 'https://images.unsplash.com/photo-1643255083197-18721220670e?q=80&w=3432&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                    }}
                    style={styles.topImage}
                />
                <View style={styles.overlay}></View>
                <Text style={styles.welcomingName}>Hi, Maldini!</Text>
                <Text style={styles.welcoming}>How are you?</Text>

            </View>



            <View style={styles.cardContainer}>

                <View style={styles.card}>
                    <Image
                        source={
                            require('../../assets/bookingAnimation.png')
                        }
                        style={styles.bookingAnimation}
                    />

                    <Text style={styles.title}>
                        Please Confirm Your Request:
                    </Text>

                    <View style={styles.cardUser}>

                        <View style={styles.infoUser}>
                            <Image
                                source={{
                                    uri: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=3322&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                }}
                                style={styles.avatar}
                            />
                            <View>
                                <View style={styles.userDetail}>
                                    <Text style={styles.name}>Maldini Junior</Text>
                                    <Text style={styles.status}>Requested</Text>
                                </View>

                                <Text style={styles.status}>@maldinigay</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={handleOnCancel} style={styles.buttonCancel}>

                            <Text style={styles.buttonText}>Cancel</Text>

                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleOnAccept} style={[
                            styles.buttonConfirm,
                            { backgroundColor: status === 'booked' ? '#4CAF50' : '#2b471f' }, // Ganti warna tombol jika status booked
                        ]}>

                            <Text style={styles.buttonText}>{status === 'booked' ? 'Booked' : 'Accept'}</Text>

                        </TouchableOpacity>
                    </View>


                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e8e9f0'
    },
    overlayContainer: {
        position: 'relative',
    },
    topImage: {
        width: "100%",
        height: 250,
        borderBottomEndRadius: 70,
        borderBottomStartRadius: 70,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "black",
        opacity: 0.5,
        borderBottomEndRadius: 70,
        borderBottomStartRadius: 70,
    },
    welcomingName: {
        position: 'absolute',
        left: 20,
        top: 20,
        fontSize: 30,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 80,
        padding: 20
    },
    welcoming: {
        position: 'absolute',
        left: 20,
        top: 20,
        fontSize: 20,
        fontWeight: '300',
        color: 'white',
        marginTop: 115,
        padding: 20
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
        marginTop: 20,
        zIndex: 10,
        marginBottom: 40
    },
    cardContainer: {
        flex: 1,
        alignItems: "center",
        flexDirection: 'column'
    },
    card: {
        flex: 1,
        marginTop: -30,
        width: "90%",
        height: 350,
        borderRadius: 40,
        backgroundColor: "white",
        alignItems: "center",
        marginBottom: 20,
    },
    cardUser: {
        width: 300,
        height: 70,
        borderRadius: 15,
        backgroundColor: "white",
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    infoUser: {
        flexDirection: 'row',
        gap: 10,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    userDetail: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 50
    },
    status: {
        color: "grey",
        fontSize: 11
    },
    name: {
        fontWeight: 'bold',
        fontSize: 13
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
        alignItems: 'center'
    },
    buttonCancel: {
        width: 140,
        height: 40,
        backgroundColor: '#632b27',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonConfirm: {
        width: 140,
        height: 40,
        backgroundColor: '#2b471f',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        color: 'white'
    },
    bookingAnimation: {
        width: 200,
        height: 250,
        position: 'absolute',
        marginTop: 240,
        opacity: 0.2
    }

});
