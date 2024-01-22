import React, { useContext, useEffect, useState } from "react";
import { Image, Keyboard, KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { SelectList } from "react-native-dropdown-select-list";


const tags = [
    "Sneakers",
    "Wedges",
    "Heels",
    "Purse",
    "Dress",
    "Suits",
    "Coat",
    "Scarf",
    "Winter Padding",
    "Accessories",
    "Earrings",
    "Necklace",
    "Bracelets",
    "Brooch",
    "Luis Vuitton",
    "Gucci",
    "Armani",
    "Rolex",
];


export default function Register({ navigation }) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState();
    const [items, setItems] = useState([]);

    useEffect(() => {
        setItems(tags.map((tag) => ({ label: tag, value: tag })));
    }, [])

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <View style={styles.header}>
                    <Image
                        source={require('../../assets/logo_black.png')}
                        style={{ width: 550, height: 50 }}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="username"
                    // value={username}
                    // onChangeText={setUsername}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="email"
                    // value={username}
                    // onChangeText={setUsername}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="name"
                    // value={username}
                    // onChangeText={setUsername}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="password"
                        // value={password}
                        // onChangeText={setPassword}
                        secureTextEntry={true}
                    />

                    <View style={styles.dropDown}>
                        <DropDownPicker
                            dropDownContainerStyle={{ backgroundColor: "#f0f0f0", borderRadius: 20, borderColor: "transparent" }}
                            style={{ backgroundColor: "#f0f0f0", borderRadius: 30, borderColor: "transparent" }}
                            dropDownDirection="TOP"
                            multiple={true}
                            min={0}
                            max={18}
                            open={open}
                            value={value}
                            items={items}
                            setOpen={setOpen}
                            setValue={setValue}
                            theme="LIGHT"
                            // multiple={true}
                            mode="BADGE"
                            badgeDotColors={[
                                "#e76f51",
                                "#00b4d8",
                                "#e9c46a",
                                "#e76f51",
                                "#8ac926",
                                "#00b4d8",
                                "#e9c46a",
                            ]}
                            placeholder="Select your interest"
                            placeholderStyle={{ color: "#a0a0a0", fontSize: 13, marginLeft: 10 }}
                            
                        />
                    </View>

                </View>
                <TouchableOpacity style={styles.buttonLogin}>
                    <Text style={{ color: 'white' }}>Register</Text>
                </TouchableOpacity>
                <View style={styles.buttonRegister}>
                    <Text style={{ color: 'black' }}>Don't have an account ?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                        <Text style={{ color: 'blue' }}>Register</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
        backgroundColor: '#ffffff',
    },

    header: {
        alignItems: 'center',
        marginBottom: 30
    },

    title: {
        fontSize: 23,
        fontWeight: 'bold',
    },

    inputContainer: {
        marginBottom: 20,
    },

    input: {
        width: 250,
        borderRadius: 30,
        backgroundColor: '#f1f1f1',
        marginBottom: 5,
        marginTop: 5,
        padding: 20,

    },
    dropDown: {
        width: 250,
        borderRadius: 30,
        backgroundColor: '#f1f1f1',
        marginBottom: 5,
        marginTop: 5,
    },
    image: {
        width: 10,
        height: 10
    },

    buttonLogin: {
        backgroundColor: 'black',
        borderRadius: 25,
        width: 150,
        height: 43,
        justifyContent: 'center',
        alignItems: 'center',
    },

    buttonRegister: {
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 5
    }
});
