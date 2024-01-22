import React, { useContext, useEffect, useState } from "react";
import { Image, Keyboard, KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { SelectList } from "react-native-dropdown-select-list";
import { USER_REGISTER } from "../queries/query";
import { useMutation } from "@apollo/client";


const tagsExample = [
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

const location = [
    "Jakarta Selatan",
    "Jakarta Timur",
    "Jakarta Barat",
    "Jakarta Pusat",
];

const genderExample = [
    "Male",
    "Female",
]


export default function Register({ navigation }) {
    const [name, onChangeName] = useState('')
    const [username, onChangeUsername] = useState('')
    const [email, onChangeEmail] = useState('')
    const [password, onChangePassword] = useState('')
    const [gender, onChangeGender] = useState('')
    const [imgUrl, onChangeImgUrl] = useState('')
    const [tags, setTags] = useState([])
    const [userLocations, setUserLocation] = useState('')
    const [errorMessage, setErrorMessage] = useState('');


    const [register, { loading, error, data }] = useMutation(USER_REGISTER)

    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([]);

    const handleOnSubmit = () => {
        if (!name || !username || !email || !password || !gender || !imgUrl || !tags || !userLocations) {
            setErrorMessage('All fields are required')
            return
        }

        register({
            variables: {
                newUser: {
                    name,
                    username,
                    email,
                    password,
                    gender,
                    imgUrl,
                    tags,
                    userLocations
                }
            },
            refetchQueries: [
                USER_REGISTER
            ],
            onCompleted: () => {
                onChangeName(''),
                    onChangeUsername(''),
                    onChangeEmail(''),
                    onChangePassword(''),
                    onChangeGender(''),
                    setTags([]),
                    setUserLocation(''),
                    navigation.navigate('Login')
            },
            onError: (error) => {
                // console.log(error)
            }
        })
    }

    useEffect(() => {
        setItems(tagsExample.map((tag) => ({ label: tag, value: tag })));
    }, [])

    // console.log(name, username, email, password, gender, imgUrl, tags, userLocations)

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
                    {errorMessage ? (
                        <Text style={{ color: 'red', marginLeft: 4, fontSize: 10 }}>*{errorMessage}</Text>
                    ) : null}
                    <TextInput
                        style={styles.input}
                        placeholder="name"
                        value={name}
                        onChangeText={onChangeName}
                        placeholderTextColor="#a0a0a0"

                    />

                    <TextInput
                        style={styles.input}
                        placeholder="username"
                        value={username}
                        onChangeText={onChangeUsername}
                        placeholderTextColor="#a0a0a0"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="email"
                        value={email}
                        onChangeText={onChangeEmail}
                        placeholderTextColor="#a0a0a0"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="password"
                        value={password}
                        onChangeText={onChangePassword}
                        secureTextEntry={true}
                        placeholderTextColor="#a0a0a0"
                    />

                    <View style={styles.dropDownLocation}>
                        <SelectList
                            setSelected={(val) => onChangeGender(val)}
                            data={genderExample}
                            save="value"
                            defaultValue={gender}
                            boxStyles={{ borderColor: "transparent" }}
                            inputStyles={{ color: "#a0a0a0", borderColor: 'transparent', fontSize: 12 }}
                            dropdownTextStyles={{ color: "#a0a0a0" }}
                            placeholder="Select your gender"
                        />
                    </View>

                    <TextInput
                        style={styles.input}
                        placeholder="image url"
                        value={imgUrl}
                        onChangeText={onChangeImgUrl}
                        placeholderTextColor="#a0a0a0"
                    />

                    <View style={styles.dropDown}>
                        <DropDownPicker
                            dropDownContainerStyle={{ backgroundColor: "#f0f0f0", borderRadius: 20, borderColor: "transparent" }}
                            style={{ backgroundColor: "#f0f0f0", borderRadius: 30, borderColor: "transparent", paddingRight: 20 }}
                            dropDownDirection="TOP"
                            multiple={true}
                            min={0}
                            max={18}
                            open={open}
                            value={tags}
                            items={items}
                            setOpen={setOpen}
                            setValue={setTags}
                            theme="LIGHT"
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
                            placeholderStyle={{ color: "#a0a0a0", fontSize: 12, marginLeft: 10 }}
                        />
                    </View>

                    <View style={styles.dropDownLocation}>
                        <SelectList
                            setSelected={(val) => setUserLocation(val)}
                            data={location}
                            save="value"
                            defaultValue={userLocations}
                            boxStyles={{ borderColor: "transparent" }}
                            inputStyles={{ color: "#a0a0a0", borderColor: 'transparent', fontSize: 12 }}
                            dropdownTextStyles={{ color: "#a0a0a0" }}
                            placeholder="Select your location"

                        />
                    </View>

                </View>

                <TouchableOpacity style={styles.buttonLogin} onPress={handleOnSubmit} >
                    <Text style={{ color: 'white' }}>Register</Text>
                </TouchableOpacity>

                <View style={styles.buttonRegister}>
                    <Text style={{ color: 'black' }}>Already have an account ?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={{ color: 'blue' }}>Login</Text>
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
        height: 45,
        borderRadius: 30,
        backgroundColor: '#f1f1f1',
        marginBottom: 5,
        marginTop: 5,
        paddingLeft: 20,
        placeholderStyle: { color: "#a0a0a0" },
        fontSize: 12,
    },
    dropDown: {
        width: 250,
        height: 45,
        borderRadius: 30,
        backgroundColor: '#f1f1f1',
        marginBottom: 5,
        marginTop: 5,
    },
    dropDownLocation: {
        width: 250,
        height: -45,
        borderRadius: 30,
        backgroundColor: '#f1f1f1',
        marginBottom: 5,
        marginTop: 10,
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
