import { useEffect, useState } from 'react';

import { NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator }
from '@react-navigation/native-stack';

import {
  onAuthStateChanged,
} from 'firebase/auth';

import { auth, db } from '../firebase/config';

import { doc, updateDoc, serverTimestamp,} from 'firebase/firestore';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import UserListScreen from '../screens/UserListScreen';
import ChatScreen from '../screens/ChatScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

   const updateUserStatus = async (
    uid,
    isOnline
  ) => {

    try {

      await updateDoc(
        doc(db, 'users', uid),
        {
          isOnline,
          lastSeen: serverTimestamp(),
        }
      );

    } catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setLoading(false);
          if (currentUser) {
          updateUserStatus(
            currentUser.uid,
            true
          );
        }
      }
    
    );

    return unsubscribe;

  }, []);

  if (loading) {
    return null;
  }

 

  return (

    <NavigationContainer>

      <Stack.Navigator>

        {user ? (

           <>

              <Stack.Screen
                name="Users"
                component={UserListScreen}
              />

              <Stack.Screen
                name="Chat"
                component={ChatScreen}
              />

            </>

        ) : (

          <>

            <Stack.Screen
              name="Login"
              component={LoginScreen}
            />

            <Stack.Screen
              name="Register"
              component={RegisterScreen}
            />

          </>

        )}

      </Stack.Navigator>

    </NavigationContainer>

  );
}