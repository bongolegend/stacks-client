// CreateGoal.tsx
import React, { useRef, useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createGoal } from './api';
import { RootStackParamList } from './types';
import { useNotification } from './NotificationContext';
import { useUser } from './UserContext';

type CreateGoalScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CreateGoal'>;

const CreateGoal: React.FC = () => {
  const navigation = useNavigation<CreateGoalScreenNavigationProp>();
  const { showNotification } = useNotification();
  const { user } = useUser();
  const textInputRef = useRef<TextInput>(null);
  const [description, setDescription] = useState<string>('');

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createGoal,
    onSuccess: () => {
      queryClient.invalidateQueries(['goals']);
      showNotification('Goal Posted');
      navigation.goBack();
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      if (textInputRef.current) {
        textInputRef.current.focus();
      }
    }, 300); // Delay to ensure screen transition is complete
    return () => clearTimeout(timer);
  }, []);

  const handlePost = () => {
    if (user) {
      mutation.mutate({ user_id: user.id, description, is_completed: false });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>X</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.postButton} onPress={handlePost}>
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          ref={textInputRef}
          style={styles.textInput}
          placeholder="Enter your goal..."
          multiline
          value={description}
          onChangeText={setDescription}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default CreateGoal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  button: {
    padding: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    color: '#000',
  },
  postButton: {
    padding: 10,
    backgroundColor: '#03A9F4',
    borderRadius: 5,
  },
  postButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  inputContainer: {
    flex: 1,
    padding: 16,
  },
  textInput: {
    flex: 1,
    fontSize: 18,
    textAlignVertical: 'top', // For Android to align text at the top
  },
});
