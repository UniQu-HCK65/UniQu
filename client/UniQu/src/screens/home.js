import { StyleSheet, Text, View, Button } from 'react-native';

export default function Home({navigation}) {
    return (
        <View>
            <Text>Home</Text>
            <Button title="Go to Login" onPress={() => navigation.navigate('Login')} />
        </View>
    )
}