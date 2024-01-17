import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, CardStyleInterpolators } from '@react-navigation/native-stack';
import Home from '../screens/home';
import Login from '../screens/login';
import Register from '../screens/register';
import LandingPage from '../screens/landingPage';
import { LoginContext } from '../context/LoginContext';
import { useContext } from 'react';
import LogoutButton from '../components/logoutButton';


const Stack = createNativeStackNavigator();


export default function StackNavigator() {

    const { isLoggedIn } = useContext(LoginContext)

    return (
        
        <Stack.Navigator 
            screenOptions={{
                gestureDirection: 'vertical',
            }}
        >

            {isLoggedIn ? (
                 <Stack.Screen
                 name="Home"
                 component={Home}
             />
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
            

        </Stack.Navigator>
    )
}