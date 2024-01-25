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
import ListChat from "../screens/list-chat";
import HomeforTalent from "../screens/homeCMST";
import StatusBooking from "../screens/statusBooking";
import ListBookingTalent from "../screens/listBookingDetail";
import EditStatusBooking from "../screens/editStatusBooking";
import ProfileTalent from "../screens/profileTalent";
import EditProfileTalent from "../screens/editProfileTalent";
import MyTabsTalent from "./tabNavigatorTalent";
import WebViewPayment from "../screens/webViewPayment";

const Stack = createNativeStackNavigator();

//update

export default function StackNavigator() {
  const { isLoggedIn } = useContext(LoginContext);
  const role = isLoggedIn.role;
  const token = isLoggedIn.accessToken;
  console.log(role, token);

  return (
    <Stack.Navigator screenOptions={{ gestureDirection: "vertical" }}>
      {!token || !role ? (
        <>
          <Stack.Screen
            name="LandingPage"
            component={LandingPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{ headerShown: false }}
          />
        </>
      ) : role === "user" ? (
        <>
          <Stack.Screen
            name="Home"
            component={MyTabs}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="TalentDetails"
            component={TalentDetails}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Booking"
            component={Booking}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Status Booking"
            component={StatusBooking}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Chat"
            component={Chat}
            options={{ headerShown: false }}
          />

          <Stack.Screen name="Edit Profile" component={EditProfileUser} />

          <Stack.Screen name="Profile" component={ProfileUser} />

          <Stack.Screen
            name="webView"
            component={WebViewPayment}
            options={{ headerShown: false }}
          />
        </>
      ) : role === "talent" ? (
        <>
          <Stack.Screen
            name="Home Talent"
            component={MyTabsTalent}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="List Booking Detail"
            component={ListBookingTalent}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Konfirmasi Booking"
            component={EditStatusBooking}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Chat"
            component={Chat}
            options={{ headerShown: false }}
          />

          <Stack.Screen name="Profile" component={ProfileTalent} />
        </>
      ) : null}
    </Stack.Navigator>
  );
}
