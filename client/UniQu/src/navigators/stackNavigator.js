import { NavigationContainer } from "@react-navigation/native";
import {
    createNativeStackNavigator,
    CardStyleInterpolators,
} from "@react-navigation/native-stack";
import Home from "../screens/home";
import Login from "../screens/login";
import Register from "../screens/register";
import LandingPage from "../screens/landingPage";
import { LoginContext } from "../context/LoginContext";
import { useContext } from "react";
import TalentDetails from "../screens/talentDetails";
import ProfileUser from "../screens/profileUser";
import EditProfileUser from "../screens/editProfileUser";
import MyTabs from "../navigators/tabNavigator";
import Chat from "../screens/chat";
import Booking from "../screens/booking";


const Stack = createNativeStackNavigator();

export default function StackNavigator() {
    const { isLoggedIn } = useContext(LoginContext);

    return (
        <Stack.Navigator
            screenOptions={{
                gestureDirection: "vertical",
            }}
        >
            {isLoggedIn ? (
                <>

                    <Stack.Screen
                        name="Home"
                        component={MyTabs}
                        options={{
                            headerShown: false,
                        }}
                    />

                    <Stack.Screen
                        name="Edit Profile"
                        component={EditProfileUser}
                    />

                    <Stack.Screen
                        name="Profile"
                        component={ProfileUser}
                    />

                    <Stack.Screen
                        name="Chat"
                        component={Chat}
                        options={{
                            headerShown: false
                        }}
                    />

                    <Stack.Screen
                        name="TalentDetails"
                        component={TalentDetails}
                        options={{
                            headerShown: false
                        }}
                    />
                <Stack.Screen
                    name="Booking"
                    component={Booking}
                />
                </>
            ) : (
                <>
                    <Stack.Screen
                        name="LandingPage"
                        component={LandingPage}
                        options={{
                            headerShown: false,
                        }}
                    />

                    <Stack.Screen
                        name="Login"
                        component={Login}
                        options={{
                            headerShown: false,
                        }}
                    />

                    <Stack.Screen
                        name="Register"
                        component={Register}
                        options={{
                            headerShown: false,
                        }}
                    />
                </>
            )}

        </Stack.Navigator >
    );
}
