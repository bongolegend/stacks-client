// Filename: screens/CreateMilestone.tsx
import React, { useState, useRef, useEffect } from 'react';
import { View, KeyboardAvoidingView, Platform, StyleSheet, TextInput, TouchableOpacity, Text } from 'react-native';
import { createGoal } from '../services/api';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotification } from '../contexts/NotificationContext';
import { useUser } from '../contexts/UserContext';

const CreateMilestone: React.FC = () => {
  const [description, setDescription] = useState<string>('');
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const { showNotification } = useNotification();
  const { user } = useUser();
  const textInputRef = useRef<TextInput>(null);
  const route = useRoute();
  const { goalId } = route.params;

  const mutation = useMutation({
    mutationFn: createGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['goals']});
      queryClient.invalidateQueries({queryKey: ['milestones', goalId]});
      showNotification('Milestone created');
      navigation.goBack();
    },
  });

  const handlePost = (data: any) => {
    if (user) {
      mutation.mutate({ user_id: user.id, ...data });
    }
  };


  useEffect(() => {
    const timer = setTimeout(() => {
      if (textInputRef.current) {
        textInputRef.current.focus();
      }
    }, 300); 
    return () => clearTimeout(timer);
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={styles.innerContainer}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
              <Text style={styles.buttonText}>X</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.postButton} onPress={() => handlePost({ parent_id: goalId, description, is_completed: false })}>
              <Text style={styles.postButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              ref={textInputRef}
              style={styles.textInput}
              placeholder="Enter your milestone..."
              multiline
              value={description}
              onChangeText={setDescription}
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default CreateMilestone;

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
    padding: 16,
  },
  textInput: {
    fontSize: 18,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});