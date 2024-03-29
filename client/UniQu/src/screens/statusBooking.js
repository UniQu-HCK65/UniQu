import { useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { GET_BOOKING_BY_ID, GET_TRANSACTION } from "../queries/query";
import RatingModal from "../components/modalRating";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import Ionicons from 'react-native-vector-icons/EvilIcons';

export default function StatusBooking({ navigation, route }) {
    const isFocus = useIsFocused()
    const { bookingId } = route.params
    const { loading, error, data, refetch } = useQuery(GET_BOOKING_BY_ID, { variables: { bookingId: bookingId } })
    const [isRatingModalVisible, setRatingModalVisible] = useState()

    const talentId = data?.bookingById.TalentId
    const statusBooking = data?.bookingById?.bookStatus;
    const [status, setStatus] = useState({
        requested: false,
        booked: false,
        started: false,
        endSession: false,
        Reviewed: false
    });

    console.log(status)
    const [buttonShow, setButtonShow] = useState(false);

    const {
        loading: loadingTransaction,
        error: errorTransaction,
        data: dataTransaction,
        refetch: refetchTransaction
    } = useQuery(GET_TRANSACTION, { variables: { bookingId: bookingId } })

    const convertToDate = (timestamp) => {
        const date = new Date(parseInt(timestamp));
        return date.toLocaleDateString();
    };

    const convertTemp = () => {
        if (statusBooking === 'requested') {
            setStatus({
                requested: true,
                booked: false,
                inprogress: false,
                started: false,
                endSession: false,
                Reviewed: false
            });
            setButtonShow(false)
        } else if (statusBooking === 'booked') {
            setStatus({
                requested: true,
                booked: true,
                inprogress: false,
                started: false,
                endSession: false,
                Reviewed: false
            });
            setButtonShow(true)
        } else if (statusBooking === 'in progress') {
            setStatus({
                requested: true,
                booked: true,
                inprogress: true,
                started: false,
                endSession: false,
                Reviewed: false
            });
            setButtonShow(false)
        } else if (statusBooking === 'started') {
            setStatus({
                requested: true,
                booked: true,
                inprogress: true,
                started: true,
                endSession: false,
                Reviewed: false
            });
            setButtonShow(false)
        } else if (statusBooking === 'ended') {
            setStatus({
                requested: true,
                booked: true,
                inprogress: true,
                started: true,
                endSession: true,
                Reviewed: false
            });
            setButtonShow(false)
        } else if (statusBooking === 'Reviewed') {
            setStatus({
                requested: true,
                booked: true,
                inprogress: true,
                started: true,
                endSession: true,
                Reviewed: true
            });
            setButtonShow(false)
        }
    };

    const handleRefresh = async () => {
        await refetch();
        await refetchTransaction()
    }

    const showRatingModal = () => {
        setRatingModalVisible(true);
    };

    useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                try {
                    await refetch();
                    await refetchTransaction()
                } catch (error) {
                    console.log(error, "error refetch");
                }
            };
            fetchData();
        }, [data])
    );

    // useEffect(() => {
    //     if(isFocus) {
    //         refetch()
    //     }
    // }, [isFocus])

    useEffect(() => {
        convertTemp();
        if (statusBooking === "Reviewed") {
            console.log("pop up modal! Booking has ended!");
            showRatingModal();
        } else {
            setRatingModalVisible(false);
        }
        refetch();
    }, [statusBooking]);

    const paymentLink = dataTransaction?.getTransactionLink?.paymentLink

    useEffect(() => {
        if (paymentLink && status.requested === true && status.booked === true && status.started === false && status.endSession === false) {
            setButtonShow(true)
        }
    }, [paymentLink])

    if (loading) {
        return <Text>Loading...</Text>
    }

    if (error) {
        return <Text>Error fetching data</Text>
    }

    return (
        <>
            <View style={styles.container}>
                <Image
                    source={{
                        uri:
                            "https://images.unsplash.com/photo-1519554318711-aaf73ece6ff9?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    }}
                    style={styles.backgroundImage}
                />
                <View style={styles.overlay}></View>

                <View style={{ position: 'absolute' }}>
                    <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'white', marginTop: 180, marginLeft: 45 }}>Hi, {data?.bookingById?.userName} !</Text>
                </View>

                <View style={{ position: 'absolute' }}>
                    <Text style={{ fontSize: 15, fontWeight: 'normal', color: 'white', marginTop: 220, marginLeft: 45 }}>This is your booking status..</Text>
                </View>

                <View style={styles.card}>

                    <View style={{ flexDirection: "column", alignItems: "flex-start", maxWidth: 305, gap: 15, marginRight: 20, marginBottom: 60 }}>
                        <View style={{ flexDirection: "row", alignItems: "start", gap: 10 }}>
                            <StatusCircle active={status.requested} />
                            <View style={{}}>
                                <StatusText active={status.requested} style={{ fontWeight: 'bold' }}>Requested</StatusText>
                                <CopyWritingText active={status.requested}>Your request is being processed. We will provide confirmation shortly</CopyWritingText>
                            </View>
                            <View style={styles.connector} />
                        </View>

                        <View style={{ flexDirection: "row", alignItems: "start", gap: 10 }}>
                            <StatusCircle active={status.booked} />
                            <View style={{}}>
                                <StatusText active={status.booked} style={{ fontWeight: 'bold' }}>Booked</StatusText>
                                <CopyWritingText active={status.booked}>Your session has been booked. We will provide confirmation shortly</CopyWritingText>
                            </View>
                            <View style={styles.connector} />
                        </View>

                        <View style={{ flexDirection: "row", alignItems: "start", gap: 10 }}>
                            <StatusCircle active={status.inprogress} />
                            <View style={{}}>
                                <StatusText active={status.inprogress} style={{ fontWeight: 'bold' }}>In Progress</StatusText>
                                <CopyWritingText active={status.inprogress}>Payment has been accepted. See u later!</CopyWritingText>
                            </View>
                            <View style={styles.connector} />
                        </View>

                        <View style={{ flexDirection: "row", alignItems: "start", gap: 10 }}>
                            <StatusCircle active={status.started} />
                            <View style={{}}>
                                <StatusText active={status.started} style={{ fontWeight: 'bold' }}>Started</StatusText>
                                <CopyWritingText active={status.started}>Your session has started. We will provide confirmation shortly</CopyWritingText>
                            </View>
                            <View style={styles.connector} />
                        </View>

                        <View style={{ flexDirection: "row", alignItems: "start", gap: 10 }}>
                            <StatusCircle active={status.endSession} />
                            <View style={{}}>
                                <StatusText active={status.endSession} style={{ fontWeight: 'bold' }}>End</StatusText>
                                <CopyWritingText active={status.endSession}>Session complete! Thank you for using our service.</CopyWritingText>
                            </View>
                            <View style={styles.connector} />
                        </View>

                        <View style={{ flexDirection: "row", alignItems: "start", gap: 10 }}>
                            <StatusCircle active={status.Reviewed} />
                            <View style={{}}>
                                <StatusText
                                    active={status.Reviewed}
                                    style={{ fontWeight: "bold" }}
                                >
                                    Reviewed
                                </StatusText>
                                <CopyWritingText active={status.Reviewed}>
                                    Please rate us.
                                </CopyWritingText>
                            </View>
                        </View>

                        <RatingModal
                            bookingId={bookingId}
                            talentId={talentId}
                            isVisible={isRatingModalVisible}
                            onClose={() => setRatingModalVisible(false)}
                            onSubmit={(data) => {
                                console.log(data, ">>>> review data yang diterima");
                                setRatingModalVisible(false);
                            }}
                        />
                    </View>
                </View>



                <View style={{ justifyContent: "center", alignContent: "center", flex: 1, marginBottom: 250, marginHorizontal: 40, position: 'relative' }}>
                    <View style={{ backgroundColor: "black", width: "100%", height: 150, justifyContent: "center", alignItems: "center", borderRadius: 20 }}>
                        <Image
                            source={{ uri: data.bookingById.talentImgUrl }}
                            style={{
                                width: 60,
                                height: 60,
                                borderRadius: 40,
                            }}
                        />
                        <Text style={{ color: 'white', fontWeight: 'bold', marginTop: 10 }}>{data?.bookingById?.talentName}</Text>
                        <Text style={{ color: 'white', fontWeight: '500' }}>{data?.bookingById?.bookStatus}</Text>
                        <Text style={{ color: 'white', fontWeight: '500', fontSize: 10 }}>{convertToDate(data?.bookingById?.bookDate)} | {data?.bookingById?.bookSession}</Text>
                    </View>

                </View>

            </View >
            {buttonShow && (
                <View style={{ justifyContent: 'center', alignItems: 'center', position: 'absolute', marginTop: 830, marginLeft: 140, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => navigation.navigate('webView', { url: paymentLink, bookingId: bookingId })} style={{ height: 35, width: 150, backgroundColor: '#1c5c2d', justifyContent: 'center', alignItems: 'center', borderRadius: 20 }}>
                        <Text style={{ color: "white", fontWeight: "bold", fontSize: 15 }}>Pay now!</Text>
                    </TouchableOpacity>
                </View>

            )}
            <View style={{ justifyContent: 'center', alignItems: 'center', position: 'absolute', marginTop:50, marginLeft: 360, flex: 1 }}>
                <TouchableOpacity onPress={handleRefresh} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="refresh" size={40} color="white" />
                </TouchableOpacity>
            </View>

        </>
    );
}

const StatusConnector = () => (
    <View style={{ borderLeftWidth: 2, borderLeftColor: "black", height: 50, position: "absolute", marginLeft: 7 }} />
);

const StatusCircle = ({ active }) => (
    <View style={{ height: 15, width: 15, backgroundColor: active ? "black" : "lightgrey", borderRadius: 10, marginTop: 5 }} />
);
const StatusText = ({ active, children, style }) => <Text style={{ color: active ? "black" : "lightgrey", ...style }}>{children}</Text>;
const CopyWritingText = ({ active, children, style }) => <Text style={{ color: active ? "grey" : "lightgrey", ...style }}>{children}</Text>;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        width: "100%",
        height: 400,
        marginBottom: 400,
        resizeMode: "cover",
        position: "absolute",
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "black",
        opacity: 0.5,
    },
    card: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: 550,
        borderRadius: 40,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        gap: 50,
    },
    cardContainer: {
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
    },
    connector: {
        borderWidth: 1,
        borderBottomColor: 'black',
        height: 50,
        width: 1,
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 7,
        position: 'absolute'
    },
});
