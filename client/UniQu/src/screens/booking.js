import { Image, StyleSheet, View, Text } from "react-native";

export default function Booking() {
    return (
        <View style={styles.container}>
            <Image
                source={require('../../assets/bookingAnimation.png')}
                style={styles.imageBackground}
            />

            <Text>hahahahha</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        
    },
    imageBackground : {
        width: 210,
        height: 270,
        resizeMode: 'cover',
        opacity: 0.5,
        position: 'absolute'
    }
})