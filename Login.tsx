// Login.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import uuid from 'react-native-uuid';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';


type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Login'>,
  route: RouteProp<RootStackParamList, 'Login'>
};

const Login: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  const mockCreateAccount = () => {
    return new Promise<{ id: string, username: string | null, email: string | null }>((resolve) => {
      setTimeout(() => {
        const user = {
          id: uuid.v4() as string,
          username: username,
          email: email,
        };
        resolve(user);
      }, 10);
    });
  };

  const handleCreateAccount = async () => {
    try {
      const user = await mockCreateAccount();
      navigation.navigate('InApp', { userId: user.id });
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to create account');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username || ''}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email || ''}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <Button title="Create Account" onPress={handleCreateAccount} />
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    width: '80%',
  },
});
