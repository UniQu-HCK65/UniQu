import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DENY_BOOKING, GET_BOOKING_BY_ID, UPDATE_BOOKING_STATUS } from "../queries/query";
import { gql, useMutation, useQuery } from "@apollo/client";
import Ionicons from 'react-native-vector-icons/EvilIcons';

export default function ListBookingTalent({ route }) {
    const bookingId = route.params.bookingId;
    const { loading, error, data, refetch } = useQuery(GET_BOOKING_BY_ID, {
        variables: {
            bookingId: bookingId,
        },
    });
    const [status, setStatus] = useState("");
    const [payment, setPayment] = useState(false);
    const [showButton, setShowButton] = useState(true);

    const [updateBook, { loading: loadingUpdateBook, error: errorUpdateBook, data: dataUpdateBook }] = useMutation(UPDATE_BOOKING_STATUS);
    const [denyBook, { loading: loadingDenyBook, error: errorDenyBook, data: dataDenyBook }] = useMutation(DENY_BOOKING);

    useEffect(() => {
        if (!loading) {
            setStatus(data?.bookingById?.bookStatus);
        }
    }, [loading, data]);

    const handleMutation = async (mutationFunction) => {
        try {
            const response = await mutationFunction({
                variables: { bookingId: bookingId },
                onCompleted: (data) => {
                    // console.log(data);
                    setStatus(data?.updateBookingStatus?.bookStatus);
                },
                onError: (error) => {
                    console.log("Mutation error:", error);
                },
            });
        } catch (error) {
            console.log("Error:", error);
        }
    };
    const convertToDate = (timestamp) => {
        const date = new Date(parseInt(timestamp));
        return date.toLocaleDateString();
    };

    const handleOnAccept = () => {
        handleMutation(updateBook);
    };

    const handleOnCancel = () => {
        handleMutation(denyBook);
    };

    const handleOnStartSession = () => {
        handleMutation(updateBook);
    };

    const handleOnEndSession = () => {
        handleMutation(updateBook);
        setShowButton(false);
    };

    const handleRefresh = async () => {
        await refetch();
    }

    console.log(data?.bookingId?.bookStatus, '<<< status booking')


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
                <Text style={styles.welcomingName}>Hi, {data?.bookingById.talentName}!</Text>
                <Text style={styles.welcoming}>How are you?</Text>
            </View>

            <View style={styles.cardContainer}>

                <View style={styles.card}>

                    <Text style={styles.title}>
                        Please Confirm Your Request:
                    </Text>
                    <View style={styles.cardUser}>
                        <View style={styles.infoUser}>
                            <Image
                                source={{
                                    uri: data?.bookingById?.userImgUrl
                                }}
                                style={styles.avatar}
                            />
                            <View>
                                <View style={styles.userDetail}>
                                    <Text style={styles.name}>{data?.bookingById?.userName}</Text>

                                </View>
                                <Text style={styles.status}>{data?.bookingById?.bookStatus}</Text>
                                <Text style={styles.status}>{convertToDate(data?.bookingById.bookDate)}</Text>
                                <Text style={styles.status}>{data?.bookingById.bookSession}</Text>
                                <Text style={styles.status}>{data?.bookingById.bookLocation}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.buttonContainer}>
                        {showButton && status === 'requested' && !payment && (
                            <TouchableOpacity onPress={handleOnCancel} style={styles.buttonCancel}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        )}

                        {showButton && status === 'requested' && (
                            <TouchableOpacity onPress={handleOnAccept} style={[
                                styles.buttonConfirm,
                                { backgroundColor: status === 'booked' ? '#4CAF50' : '#2b471f' },
                            ]}
                                disabled={status === 'booked'}
                            >
                                <Text style={styles.buttonText}>{status === 'booked' ? 'Start Session' : 'Accept'}</Text>
                            </TouchableOpacity>
                        )}

                        {showButton && status === 'booked' && (
                            <TouchableOpacity style={styles.waitingPayment}>
                                <Text style={styles.buttonText}>Waiting for payment..</Text>
                            </TouchableOpacity>
                        )}

                        {showButton && status === 'in progress' && (
                            <TouchableOpacity onPress={handleOnStartSession} style={styles.buttonConfirm}>
                                <Text style={styles.buttonText}>Started</Text>
                            </TouchableOpacity>
                        )}

                        {showButton && status === 'started' && (
                            <TouchableOpacity onPress={handleOnEndSession} style={styles.endSession}>
                                <Text style={styles.buttonText}>End Session</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', position: 'absolute', marginTop: 50, marginLeft: 330, flex: 1 }}>
                <TouchableOpacity onPress={handleRefresh} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="refresh" size={40} color="white" />
                </TouchableOpacity>
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
        height: 100,
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
        alignItems: 'flex-start',
        padding: 20
    },
    infoUser: {
        flexDirection: 'row',
        gap: 20,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    userDetail: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: 50
    },
    status: {
        color: "grey",
        fontSize: 11,
        marginTop: 3
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
    },
    waitingPayment: {
        width: 170,
        height: 40,
        backgroundColor: 'grey',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    onProgress: {
        width: 140,
        height: 40,
        backgroundColor: 'grey',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    endSession: {
        width: 140,
        height: 40,
        backgroundColor: '#632b27',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
