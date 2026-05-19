import { View, Text, } from 'react-native';
import { useEffect } from 'react';

export default function ChatScreen({ route, navigation }) {

  const { selectedUser } = route.params;

  useEffect(() => {
    navigation.setOptions({
        title: selectedUser.email,
    });
  }, []);

  return (

    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >

      <Text>
        Chat with:
      </Text>

      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          marginTop: 10,
        }}
      >
        {selectedUser.email}
      </Text>

    </View>

  );
}