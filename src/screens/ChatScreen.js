import { useState, useRef, useEffect } from 'react';
import {
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  View,
  Text,
  StyleSheet,
} from 'react-native';

import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

import { db, auth } from '../firebase/config';

export default function ChatScreen({ route, navigation }) {

  const { selectedUser } = route.params;
  const [messages, setMessages] = useState([]);

  const [inputText, setInputText] = useState('');

  const flatListRef = useRef(null);

  const currentUser = auth.currentUser;

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    const text = inputText.trim();
    setInputText('');
    try {
      await addDoc(
        collection(db, 'messages'),
        {
          text,
          senderId: currentUser.uid,
          receiverId: selectedUser.id,
          timestamp: serverTimestamp(),
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    navigation.setOptions({
        title: selectedUser.email,
    });
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const allMessages =
          snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));

        // FILTER CHAT KHUSUS 2 USER
        const filteredMessages =
          allMessages.filter(msg =>
            (
              msg.senderId === currentUser.uid &&
              msg.receiverId === selectedUser.id
            )
            ||
            (
              msg.senderId === selectedUser.id &&
              msg.receiverId === currentUser.uid
            )
          );
        setMessages(filteredMessages);
        setTimeout(() => {
          flatListRef.current?.scrollToEnd();
        }, 100);
      }
    );
    return () => unsubscribe();
  }, []);

 return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior='padding'
    >

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}

        renderItem={({ item }) => {

          const isMyMessage =
            item.senderId === currentUser.uid;

          return (

            <View
              style={[
                styles.messageBubble,

                isMyMessage
                  ? styles.myMessage
                  : styles.otherMessage
              ]}
            >

              <Text
                style={[
                  styles.messageText,

                  isMyMessage
                    ? styles.myMessageText
                    : styles.otherMessageText
                ]}
              >
                {item.text}
              </Text>

            </View>

          );

        }}
      />

      <View style={styles.inputContainer}>

        <TextInput
          style={styles.input}

          placeholder='Ketik pesan...'

          value={inputText}

          onChangeText={setInputText}
        />

        <TouchableOpacity
          onPress={sendMessage}
          style={styles.sendButton}
        >

          <Text style={styles.sendButtonText}>
            Kirim
          </Text>

        </TouchableOpacity>

      </View>

    </KeyboardAvoidingView>

  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },

  messageBubble: {
    padding: 12,
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    maxWidth: '75%',
  },

  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },

  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ddd',
  },

  messageText: {
    fontSize: 16,
  },

  myMessageText: {
    color: 'white',
  },

  otherMessageText: {
    color: 'black',
  },

  inputContainer: {
    flexDirection: 'row',
    padding: 10,
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
  },

  sendButton: {
    marginLeft: 10,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderRadius: 10,
  },

  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },

});