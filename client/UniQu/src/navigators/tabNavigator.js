import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/home';
import ProfileUser from '../screens/profileUser';
import Ionicons from 'react-native-vector-icons/AntDesign';

const Tab = createBottomTabNavigator();

export default function MyTabs({ navigation }) {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home';
                    } else if (route.name === 'ProfileUser') {
                        iconName = focused ? 'user' : 'user';
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

            <Tab.Screen
                name="ProfileUser"
                component={ProfileUser}
            />
        </ Tab.Navigator>
    )
}