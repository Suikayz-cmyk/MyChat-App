import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet,} from 'react-native';

import {createUserWithEmailAndPassword,} from 'firebase/auth';
import { auth } from '../firebase/config';

import {doc, setDoc, serverTimestamp,} from 'firebase/firestore';
import { db } from '../firebase/config';

export default function LoginScreen({ navigation }) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!email || !password) {
      alert('Email dan password wajib diisi');
      return;
    }

    try {
      //Buat akun auth
      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
      const user = userCredential.user;
      //Simpan profile ke Firestore
      await setDoc(
        doc(db, 'users', user.uid),
        {
          email: user.email,
          createdAt: serverTimestamp(),
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

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
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
        onPress={() => navigation.navigate('Login')}
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
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 14,
    marginBottom: 15,
  },

  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  link: {
    marginTop: 20,
    textAlign: 'center',
    color: '#007AFF',
  },

});