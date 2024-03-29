import { Text, TouchableOpacity, View } from "react-native";
import { useContext } from "react";
import { LoginContext } from "../context/LoginContext";
import * as SecureStore from 'expo-secure-store'

import Ionicons from 'react-native-vector-icons/Ionicons';



export default function LogoutButton() {
    const { setIsLoggedIn } = useContext(LoginContext)
    return (
        <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 50}}>
            <View style={{ width: 130, height: 45, backgroundColor: '#611a2d', borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginVertical: 30 }}>
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }} onPress={async () => {
                    await SecureStore.deleteItemAsync('accessToken')
                    await SecureStore.deleteItemAsync('role')
                    setIsLoggedIn(false)
                }}>
                    <Text style={{ color: 'white' }}>Logout</Text>
                    {/* <Ionicons name="exit-outline" size={22} color="black" style={{ marginRight: 10 }} /> */}

                </TouchableOpacity>
            </View>
        </View>
    )
}