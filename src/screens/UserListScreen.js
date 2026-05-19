import { useEffect, useState,} from 'react';
import { View, Text, TouchableOpacity, FlatList, } from 'react-native';

import { signOut } from 'firebase/auth';
import { collection, getDocs,} from 'firebase/firestore';
import { db, auth } from '../firebase/config';

export default function UserListScreen({navigation}) {

  const [users, setUsers] = useState([]);

  const handleLogout = async () => {
    await signOut(auth);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {

    try {
      const snapshot =
        await getDocs(collection(db, 'users'));

      const userList = snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter(
        user => user.id !== auth.currentUser.uid
      );

      setUsers(userList);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
      }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: 'bold',
          marginBottom: 20,
        }}
      >
        Users
      </Text>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (

          <TouchableOpacity
            onPress={() =>
              navigation.navigate(
                'Chat',
                {
                  selectedUser: item,
                }
              )
            }

            style={{
              padding: 15,
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 10,
              marginBottom: 10,
            }}
          >

            <Text>
              {item.email}
            </Text>

          </TouchableOpacity>

        )}
      />

      <TouchableOpacity
        onPress={handleLogout}
      >
        <Text
          style={{
            marginTop: 20,
            color: 'red',
            textAlign: 'center',
          }}
        >
          Logout
        </Text>
      </TouchableOpacity>

    </View>

  );
}