import { useState, useRef, useEffect } from 'react';
import {
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  View,
  Text,
  StyleSheet,
  Platform,
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
import { format, } from 'date-fns';

export default function ChatScreen({ route, navigation }) {

  const { selectedUser } = route.params;
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef(null);
  const currentUser = auth.currentUser;
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({
            animated: true,
          });
        }, 100);
      }
    );
    return () => unsubscribe();
  }, []);

 if (loading) {
  return (
    <View style={styles.loadingContainer}>
      <Text>Loading chat...</Text>
    </View>
  );
}

 return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === 'ios' ? 'padding' : undefined
      }
    >
    <View style={styles.chatHeader}>
      <Text style={styles.chatHeaderText}>
        {selectedUser.email}
      </Text>
      <Text
  style={{
    color:
      selectedUser.isOnline
        ? 'green'
        : 'gray',

    marginTop: 5,
  }}
>

  {
    selectedUser.isOnline
      ? 'Online'
      : 'Offline'
  }

</Text>
    </View>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Belum ada pesan
            </Text>
          </View>
        }
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

              <Text style={styles.timestamp}>
                {
                  item.timestamp?.seconds
                    ? format(
                        new Date(
                          item.timestamp.seconds * 1000
                        ),
                        'HH:mm'
                      )
                    : ''
                }
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
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: 'white',
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
  },

  sendButton: {
    marginLeft: 10,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 25,
  },

  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyContainer: {
    marginTop: 50,
    alignItems: 'center',
  },

  emptyText: {
    color: 'gray',
    fontSize: 16,
  },

  timestamp: {
    fontSize: 11,
    marginTop: 5,
    opacity: 0.7,
    color: 'white',
    alignSelf: 'flex-end',
  },

  chatHeader: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },

  chatHeaderText: {
    fontSize: 16,
    fontWeight: '600',
  },

  
});