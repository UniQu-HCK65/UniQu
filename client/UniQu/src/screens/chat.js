import { Text, View, StyleSheet, Image, TouchableOpacity, TextInput } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
export default function Chat() {
    return (
        <View style={styles.container}>

            <View style={{ borderBottomColor: 'grey', borderBottomWidth: 0.5 }}>
                <View style={{ flexDirection: 'row', marginHorizontal: 30, marginTop: 60, gap: 10, marginBottom: 15 }}>
                    <TouchableOpacity style={{ backgroundColor: 'white', flexDirection: 'row', gap: 10 }} >
                        <Image
                            source={{
                                uri: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"
                            }}
                            style={styles.avatarHeader}
                        />

                        <View style={{ justifyContent: 'center' }}>
                            <Text style={{ fontWeight: 'bold' }}>Maldini Junior</Text>
                            <Text style={{ color: 'gray' }}>Online</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>


            <View style={{ justifyContent: 'center', alignItems: 'center', borderTopColor: 'grey', borderTopWidth: 0.5, height: 130 }}>
                <View style={styles.messageContainer}>
                    <Ionicons name="attach" size={29} style={styles.attachButton} />
                    <TextInput
                        placeholder="Message..."
                        style={styles.inputField}
                    />
                    <Ionicons name="send" size={25} style={styles.sendButton} />
                </View>
            </View>

        </View>


    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        flex: 1,
        justifyContent: 'space-between'
    },
    avatarHeader: {
        width: 45,
        height: 45,
        borderRadius: 50
    },
    messageContainer: {
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        marginBottom: 40,
    },
    inputField: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 50,
        width: '70%',
        marginBottom: 20,
    },
    sendButton: {
        marginBottom: 20
    },
    attachButton: {
        marginBottom: 20
    },

})