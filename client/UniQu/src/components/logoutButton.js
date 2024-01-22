import { Text, TouchableOpacity } from "react-native";
import { useContext } from "react";
import { LoginContext } from "../context/LoginContext";
import * as SecureStore from 'expo-secure-store'

import Ionicons from 'react-native-vector-icons/Ionicons'; 



export default function LogoutButton() {
    const {setIsLoggedIn} = useContext(LoginContext)
    return (
        <TouchableOpacity style={{ alignItems: 'center' }}onPress={async () => {
            await SecureStore.deleteItemAsync('accessToken')
            await SecureStore.deleteItemAsync('role')
            setIsLoggedIn(false)
        }}>
            <Ionicons name="exit-outline" size={22} color="black" style={{ marginRight: 10 }} />

        </TouchableOpacity>
    )
}