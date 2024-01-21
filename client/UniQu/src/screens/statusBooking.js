import React, { useState } from "react";
import { Image, StyleSheet, View, Text } from "react-native";

export default function StatusBooking() {
    const [status, setStatus] = useState({
        requested: true,
        booked: true,
        startSession: true,
        endSession: true,
    });

    return (
        <View style={styles.container}>
            <Image
                source={{
                    uri:
                        "https://images.unsplash.com/photo-1519554318711-aaf73ece6ff9?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                }}
                style={styles.backgroundImage}
            />
            <View style={styles.overlay}></View>
            <View style={styles.card}>
                <View style={{ flexDirection: "column", alignItems: "flex-start", maxWidth: 305, gap: 15, marginRight: 20 }}>
                    <View style={{ flexDirection: "row", alignItems: "start", gap: 10 }}>
                        <StatusCircle active={status.requested} />
                        <View style={{}}>
                            <StatusText active={status.requested} style={{fontWeight: 'bold'}}>Requested</StatusText>
                            <CopyWritingText active={status.requested}>Your request is being processed. We will provide confirmation shortly</CopyWritingText>
                        </View>
                        <View style={styles.connector} />
                    </View>

                    <View style={{ flexDirection: "row", alignItems: "start", gap: 10 }}>
                        <StatusCircle active={status.booked} />
                        <View style={{}}>
                            <StatusText active={status.booked} style={{fontWeight: 'bold'}}>Booked</StatusText>
                            <CopyWritingText active={status.booked}>Your session has been booked. We will provide confirmation shortly</CopyWritingText>
                        </View>
                        <View style={styles.connector} />
                    </View>

                    <View style={{ flexDirection: "row", alignItems: "start", gap: 10 }}>
                        <StatusCircle active={status.startSession} />
                        <View style={{}}>
                            <StatusText active={status.startSession} style={{fontWeight: 'bold'}}>Start Session</StatusText>
                            <CopyWritingText active={status.startSession}>Your session has started. We will provide confirmation shortly</CopyWritingText>
                        </View>
                        <View style={styles.connector} />
                    </View>

                    <View style={{ flexDirection: "row", alignItems: "start", gap: 10 }}>
                        <StatusCircle active={status.endSession} />
                        <View style={{}}>
                            <StatusText active={status.endSession} style={{fontWeight: 'bold'}}>End Session</StatusText>
                            <CopyWritingText active={status.endSession}>Session complete! Thank you for using our service. We hope you had a satisfying experience.</CopyWritingText>
                        </View>

                    </View>
                </View>

            </View>
            <View style={{ justifyContent: "center", alignContent: "center", flex: 1, marginBottom: 200, marginHorizontal: 40 }}>
                <View style={{ backgroundColor: "black", width: "100%", height: 150, justifyContent: "center", alignItems: "center", borderRadius: 20 }}>
                    <Text style={{ fontSize: 15, fontWeight: "bold", color: "white", maxWidth: 250 }}>Let's Begin! Please wait while we process your request..</Text>
                </View>
            </View>
        </View >
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
        height: 350,
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
        zIndex: 3,
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