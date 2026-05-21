import { useEffect, useState,} from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image} from 'react-native';

import { signOut } from 'firebase/auth';
import { collection, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase/config';

export default function UserListScreen({navigation}) {
  const [users, setUsers] = useState([]);

  const handleLogout = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;
      await updateDoc(
        doc(db, 'users', currentUser.uid),
        {
          isOnline: false,
          lastSeen: serverTimestamp(),
        }
      );
      await signOut(auth);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'users'),
      (snapshot) => {
        const userList = snapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter(
            user =>
              user.id !== auth.currentUser?.uid
          );
        setUsers(userList);
      }
    );
    return () => unsubscribe();
  }, []);

return (
    <View style={styles.container}>
      <View style={styles.header}>
      <Text style={styles.appTitle}>
        MyChatApp
      </Text>
      <Text style={styles.subTitle}>
        Chats
      </Text>
    </View>

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

            style={styles.userCard}
          >

            {
              item.photoURL && (

                <Image
                  source={{
                    uri: item.photoURL,
                  }}
                  style={styles.avatar}
                />

              )
            }

            <View style={styles.userInfo}>

              <Text style={styles.userName}>
                {item.name || 'Unknown'}
              </Text>

              <Text
                style={[
                  styles.statusText,

                  item.isOnline
                    ? styles.onlineText
                    : styles.offlineText
                ]}
              >

                {
                  item.isOnline
                    ? 'Online'
                    : 'Offline'
                }

              </Text>

              <Text style={styles.userEmail}>
                {item.email}
              </Text>

            </View>

          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >

        <Text style={styles.logoutButtonText}>
          Logout
        </Text>

      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
  },

  header: {
      marginBottom: 25,
    },

    appTitle: {
      fontSize: 32,
      fontWeight: 'bold',
    },

    subTitle: {
      marginTop: 5,
      fontSize: 18,
      color: 'gray',
    },

    userCard: {
      flexDirection: 'row',
      alignItems: 'center',

      padding: 15,

      backgroundColor: 'white',

      borderRadius: 15,

      marginBottom: 12,

      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 5,

      elevation: 2,
    },

    avatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
    },

    userInfo: {
      marginLeft: 15,
      flex: 1,
    },

    userName: {
      fontSize: 18,
      fontWeight: 'bold',
    },

    userEmail: {
      marginTop: 4,
      color: 'gray',
      fontSize: 13,
    },

    statusText: {
      marginTop: 2,
      fontSize: 13,
    },

    onlineText: {
      color: 'green',
    },

    offlineText: {
      color: 'gray',
    },

    logoutButton: {
      alignSelf: 'center',
      marginTop: 10,
      backgroundColor: '#ff3b30',
      paddingVertical: 10,
      paddingHorizontal: 30,
      borderRadius: 999,
      alignItems: 'center',
      opacity: 0.9,
    },

    logoutButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 12,
    },
});