import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/home";
import ProfileUser from "../screens/profileUser";
import Ionicons from "react-native-vector-icons/AntDesign";
import { MaterialIcons } from "@expo/vector-icons";
import ListChat from "../screens/list-chat";
import Search from "../screens/search";
import HomeforTalent from "../screens/homeCMST";
import ProfileTalent from "../screens/profileTalent";
import LogoutButton from "../components/logoutButton";
import ListBookingTalent from "../screens/listBookingDetail";

const Tab = createBottomTabNavigator();

export default function MyTabsTalent({ navigation }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home";
          } else if (route.name === "Profile talent") {
            iconName = focused ? "user" : "user";
          } else if (route.name === "ListChat") {
            iconName = focused ? "wechat" : "wechat";
          } else if (route.name === "History") {
            iconName = focused ? "book" : "book";
          }
          return (
            <Ionicons
              name={iconName}
              size={23}
              color={focused ? "black" : color}
            />
          );
        },
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeforTalent}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="History"
        component={ListBookingTalent}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="ListChat"
        component={ListChat}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profile talent"
        component={ProfileTalent}
        options={{
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}
