import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/home';
import ProfileUser from '../screens/profileUser';
import Ionicons from 'react-native-vector-icons/AntDesign';
import ListChat from '../screens/list-chat';
import Search from '../screens/search';
import { useContext } from 'react';
import { LoginContext } from '../context/LoginContext';

const Tab = createBottomTabNavigator();

export default function MyTabs({ navigation }) {
    const { isLoggedIn } = useContext(LoginContext);

    const role = isLoggedIn.role
    const token = isLoggedIn.accessToken
    
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'user' : 'user';
                    } else if (route.name === 'ListChat') {
                        iconName = focused ? 'wechat' : 'wechat';
                    } else if (route.name === 'Search') {
                        iconName = focused ? 'search1' : 'search1'
                    }
                    return <Ionicons name={iconName} size={23} color={focused ? 'black' : color} />;
                },
                tabBarShowLabel: false,
            })}>
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    headerShown: false
                }}
            />
            {/* <Tab.Screen
                name="Search"
                component={Search}
                options={{
                    headerShown: false
                }}
            /> */}
            <Tab.Screen
                name="ListChat"
                component={ListChat}
                options={{
                    headerShown: false
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileUser}
                options= {{
                    headerShown: false
                }}
            />
        </ Tab.Navigator>
    )
}