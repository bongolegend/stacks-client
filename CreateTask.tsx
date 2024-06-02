// CreateTask.tsx
import React, { useRef, useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, KeyboardAvoidingView, Platform } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createTask, fetchGoals } from './api';
import { RootStackParamList } from './types';
import { useNotification } from './NotificationContext';
import { useUser } from './UserContext';

type CreateTaskScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CreateTask'>;

const CreateTask: React.FC = () => {
  const navigation = useNavigation<CreateTaskScreenNavigationProp>();
  const { showNotification } = useNotification();
  const { user } = useUser();
  const textInputRef = useRef<TextInput>(null);
  const [description, setDescription] = useState<string>('');
  const [open, setOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [items, setItems] = useState<Array<{ label: string; value: string }>>([]);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
      showNotification('Task Posted');
      navigation.goBack();
    },
  });

  const { data: goals, isLoading: goalsLoading } = useQuery({
    queryKey: ['goals', user?.id],
    queryFn: () => fetchGoals(user!.id),
    enabled: !!user,
  });

  useEffect(() => {
    if (goals) {
      const formattedGoals = goals.map((goal: { id: string; description: string }) => ({
        label: goal.description,
        value: goal.id,
      }));
      setItems(formattedGoals);
    }
  }, [goals]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (textInputRef.current) {
        textInputRef.current.focus();
      }
    }, 300); // Delay to ensure screen transition is complete
    return () => clearTimeout(timer);
  }, []);

  const handlePost = () => {
    if (user && selectedGoal) {
      mutation.mutate({ user_id: user.id, goal_id: selectedGoal, description, is_completed: false });
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
        {goalsLoading ? (
          <Text>Loading goals...</Text>
        ) : (
          <DropDownPicker
            open={open}
            value={selectedGoal}
            items={items}
            setOpen={setOpen}
            setValue={setSelectedGoal}
            setItems={setItems}
            placeholder="Select a goal"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
          />
        )}
        <TextInput
          ref={textInputRef}
          style={styles.textInput}
          placeholder="Enter your task..."
          multiline
          value={description}
          onChangeText={setDescription}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default CreateTask;

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
  dropdown: {
    marginBottom: 16,
  },
  dropdownContainer: {
    marginTop: 16,
  },
  textInput: {
    fontSize: 18,
    textAlignVertical: 'top', // For Android to align text at the top
    minHeight: 100, // Ensuring TextInput doesn't overlap with dropdown
  },
});
