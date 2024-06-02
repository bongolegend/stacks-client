// Login.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { createUser } from './api';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import { useUser } from './UserContext';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'InApp'>;

const Login: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const { setUser } = useUser();

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: (data) => {
      setUser(data);
      navigation.navigate('InApp');
    },
  });

  const handleCreateUser = () => {
    mutation.mutate({ email, username });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <Button title="Create Account" onPress={handleCreateUser} />
      {mutation.isLoading && <Text>Loading...</Text>}
      {mutation.isError && <Text>Error creating user</Text>}
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  input: {
    width: '100%',
    padding: 8,
    marginBottom: 16,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
  },
});
