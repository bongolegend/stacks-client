// Filename: screens/CreateGoal.tsx
import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, StyleSheet, TextInput, Button, Text, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createGoal } from '../services/api';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useNotification } from '../contexts/NotificationContext';
import { useUser } from '../contexts/UserContext';

import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';

const CreateGoal: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [description, setDescription] = useState<string>('');
  const [errors, setErrors] = useState<{ title?: string; dueDate?: string; description?: string }>({});
  
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const { showNotification } = useNotification();
  const { user } = useUser();

  const mutation = useMutation({
    mutationFn: createGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['goals']});
      queryClient.invalidateQueries({queryKey: ['announcements']});
      showNotification('Goal Posted');
      navigation.goBack();
    },
  });

  const handlePost = (data: any) => {
    if (user) {
      mutation.mutate({ user_id: user.id, ...data });
    }
  };

  const validateFields = () => {
    const newErrors: { title?: string; dueDate?: string; description?: string } = {};
    if (!title) newErrors.title = 'Title is required';
    if (!dueDate) newErrors.dueDate = 'Due date is required';
    if (!description) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateFields()) {
      handlePost({ title, description, due_date: dueDate, is_completed: false });
    }
  };

  const handleDueDateChange = (date: Date) => {
    setDueDate(date);
    setShowDatePicker(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>X</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.postButton} onPress={handleSubmit}>
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.innerContainer}>
        <Text style={styles.screenTitle}>New Goal</Text>
        
        <Text style={styles.subtitle}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your title..."
          value={title}
          onChangeText={setTitle}
        />
        {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
        
        <Text style={styles.subtitle}>Due Date</Text>
        <View style={styles.datePickerContainer}>
          {Platform.OS === 'web' ? (
            <DatePicker
              selected={dueDate}
              onChange={handleDueDateChange}
              placeholderText="Pick Due Date"
              className="date-picker"
            />
          ) : (
            <>
              <Button title="Pick Due Date" onPress={() => setShowDatePicker(true)} />
              {showDatePicker && (
                <DateTimePicker
                  value={dueDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => handleDueDateChange(selectedDate || dueDate!)}
                />
              )}
              {dueDate && <TextInput style={styles.input} value={format(dueDate, 'MM/dd/yyyy')} editable={false} />}
            </>
          )}
        </View>
        {errors.dueDate && <Text style={styles.errorText}>{errors.dueDate}</Text>}
        
        <Text style={styles.subtitle}>Description</Text>
        <TextInput
          style={[styles.input, styles.descriptionInput]}
          placeholder="Enter your description..."
          value={description}
          onChangeText={setDescription}
          multiline
        />
        {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
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
  innerContainer: {
    flex: 1,
    padding: 16,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'darkgray',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 12,
    marginBottom: 24,
    fontSize: 16,
  },
  descriptionInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  datePickerContainer: {
    marginBottom: 24,
  },
  errorText: {
    color: 'red',
    marginBottom: 24,
  },
});