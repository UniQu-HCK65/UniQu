import React, { useContext, useEffect, useState } from "react";
import { Image, Keyboard, KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";


export default function Register({ navigation }) {


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
