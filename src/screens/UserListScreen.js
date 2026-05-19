import { View, Text, TouchableOpacity,} from 'react-native';

import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';

export default function UserListScreen() {

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >

      <Text>
        User List Screen
      </Text>

      <TouchableOpacity onPress={handleLogout}>
        <Text
          style={{
            marginTop: 20,
            color: 'red',
          }}
        >
          Logout
        </Text>
      </TouchableOpacity>

    </View>
  );
}