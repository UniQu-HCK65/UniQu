import * as SecureStore from 'expo-secure-store'
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';


const httpLink = createHttpLink({
    uri:  'http://localhost:5555'
    // uri: 'https://191c-139-228-111-126.ngrok-free.app'
})

async function getValueFor(key) {
    let result = await SecureStore.getItemAsync(key)
    
    return result
}


const authLink = setContext( async (_, { headers }) => {
    const token = await getValueFor('accessToken');
  console.log(token,">>>>>token");

    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    }
});



const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});


export default client
