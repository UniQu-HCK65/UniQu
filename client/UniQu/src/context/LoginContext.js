import { createContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
async function getValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  const data = await SecureStore.isAvailableAsync()

  return result
}

export const LoginContext = createContext(null)

export function AuthComponent({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState({
    accessToken: "",
    role: ""
  })

  useEffect(() => {
    getValueFor('accessToken').then((token) => {
      setIsLoggedIn((prev) => ({ ...prev, accessToken: token }))
    });
    getValueFor('role').then((role) => {
      setIsLoggedIn((prev) => ({ ...prev, role: role }))
    });
  }, []);

  return (
    <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </LoginContext.Provider>
  );
}