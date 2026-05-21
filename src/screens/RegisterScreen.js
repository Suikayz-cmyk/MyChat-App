import { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import { createUserWithEmailAndPassword,} from 'firebase/auth';
import { doc, setDoc, serverTimestamp,} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL,} from 'firebase/storage';
import { auth, db, storage,} from '../firebase/config';

export default function RegisterScreen({navigation}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [photoURL, setPhotoURL] = useState(null);

  const pickImage = async () => {
    try {
      const permission =
        await ImagePicker
          .requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        alert('Perlu izin galeri');
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

      if (!result.canceled) {
        uploadImage(
          result.assets[0].uri
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const uploadImage = async (
    imageUri
  ) => {
    try {
      const response =
        await fetch(imageUri);

      const blob =
        await response.blob();

      const storageRef = ref(
        storage,
        `profiles/${Date.now()}.jpg`
      );

      await uploadBytes(
        storageRef,
        blob
      );

      const downloadURL =
        await getDownloadURL(storageRef);
      setPhotoURL(downloadURL);
    } catch (error) {
      console.log(error);
      alert(
        'Firebase Storage buth upgrade plan'
      );
    }
  };

  const handleRegister = async () => {
    if (!email || !password) {
      alert(
        'Email dan password wajib diisi'
      );
      return;
    }

    try {

      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      const user =
        userCredential.user;

      await setDoc(
        doc(db, 'users', user.uid),
        {
          name:
            name ||
            email.split('@')[0],
          email: user.email,
          isOnline: true,
          createdAt: serverTimestamp(),
          photoURL:
            photoURL ||
            `https://api.dicebear.com/7.x/initials/png?seed=${
              name || email
            }`,
        }
      );
      alert('Register berhasil');
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Register
      </Text>
      
      <TouchableOpacity
        style={styles.avatarContainer}
        onPress={pickImage}
      >

        <Image
          source={{
            uri:
              photoURL ||
              `https://api.dicebear.com/7.x/initials/png?seed=${
                name || email || 'User'
              }`
          }}
          style={styles.avatar}
        />

        <Text style={styles.uploadText}>
          Tap untuk ganti foto
        </Text>

      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Nama"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
      >

        <Text style={styles.buttonText}>
          Register
        </Text>

      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          navigation.navigate('Login')
        }
      >

        <Text style={styles.link}>
          Sudah punya akun? Login
        </Text>

      </TouchableOpacity>

    </View>

  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white',
  },

  avatarContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },

  uploadText: {
    marginTop: 10,
    color: 'gray',
    fontSize: 13,
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 14,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },

  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

  link: {
    marginTop: 20,
    textAlign: 'center',
    color: '#007AFF',
  },

});