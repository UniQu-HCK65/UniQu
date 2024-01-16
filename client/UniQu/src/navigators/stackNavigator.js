import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/home';
import Login from '../screens/login';
import Register from '../screens/register';
import LandingPage from '../screens/landingPage';


const Stack = createNativeStackNavigator();


export default function StackNavigator() {
    return (
        <Stack.Navigator>

            <Stack.Screen
                name="LandingPage"
                component={LandingPage}
                options={{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name="Home"
                component={Home}
            />

            <Stack.Screen
                name="Login"
                component={Login}
            />

            <Stack.Screen
                name="Register"
                component={Register}
            />

        </Stack.Navigator>
    )
}