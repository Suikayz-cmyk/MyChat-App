import { useEffect, useState,} from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

import { signOut } from 'firebase/auth';
import { collection, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL,} from 'firebase/storage';
import { storage } from '../firebase/config';

export default function UserListScreen({navigation}) {
  const [users, setUsers] = useState([]);

  const pickImage = async () => {
    try {
      const permission =
        await ImagePicker
          .requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        alert('Izin galeri diperlukan');
        return;
      }

      const result =
        await ImagePicker
          .launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          });
      if (result.canceled) return;
      uploadProfilePhoto(
        result.assets[0].uri
      );
    } catch (error) {
      console.log(error);
    }
  };

  const uploadProfilePhoto = async (
      imageUri
    ) => {
      try {
        const response =
          await fetch(imageUri);
        const blob =
          await response.blob();
        const storageRef = ref(
          storage,
          `profiles/${auth.currentUser.uid}.jpg`
        );

        await uploadBytes(
          storageRef,
          blob
        );

        const downloadURL =
          await getDownloadURL(storageRef);

        await updateDoc(
          doc(
            db,
            'users',
            auth.currentUser.uid
          ),
          {
            photoURL: downloadURL,
          }
        );
        alert('Foto profil berhasil diupload');
      } catch (error) {
        console.log(error);
        alert(
          'Firebase Storage buth upgrade plan'
        );
      }
    };

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
      <Text style={styles.title}>
        Users
      </Text>

      <TouchableOpacity
        style={styles.uploadButton}
        onPress={pickImage}
      >

        <Text style={styles.uploadButtonText}>
          Upload Foto Profil
        </Text>

      </TouchableOpacity>

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

                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    marginBottom: 10,
                  }}
                />

              )
            }

            <Text style={styles.userEmail}>
              {item.email}
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
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>
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

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  userCard: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: 'white',
  },

  userEmail: {
    fontSize: 16,
    fontWeight: '500',
  },

  statusText: {
    marginTop: 5,
  },

  onlineText: {
    color: 'green',
  },

  offlineText: {
    color: 'gray',
  },

  logoutText: {
    marginTop: 20,
    color: 'red',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  uploadButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },

  uploadButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },

});