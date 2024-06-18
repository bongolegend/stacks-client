// Login.tsx
import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { createUser, loginUser } from './api';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import { useUser } from './UserContext';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'InApp'>;

const Login: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const { user, setUser, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && user) {
      navigation.navigate('InApp');
    }
  }, [user, isLoading, navigation]);

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: (data) => {
      setUser(data);
      navigation.navigate('InApp');
    },
  });

  const loginUserMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setUser(data);
      navigation.navigate('InApp');
    },
  });

  const handleCreateUser = () => {
    createUserMutation.mutate({ email, username });
  };

  const handleLoginUser = () => {
    loginUserMutation.mutate(username);
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <>
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
          <Button title="Login" onPress={handleLoginUser} />
          <Button title="Create Account" onPress={handleCreateUser} />
          {createUserMutation.isLoading && <Text>Loading...</Text>}
          {createUserMutation.isError && <Text>Error creating user</Text>}
          {loginUserMutation.isLoading && <Text>Loading...</Text>}
          {loginUserMutation.isError && <Text>Error logging in</Text>}
        </>
      )}
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
