// Filename: screens/CreateMilestone.tsx
import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import SharedForm from '../components/SharedForm';
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

  const mutation = useMutation({
    mutationFn: createGoal,
    onSuccess: () => {
      queryClient.invalidateQueries(['goals']);
      showNotification('Milestone created');
      navigation.goBack();
    },
  });

  const handlePost = (data: any) => {
    if (user) {
      mutation.mutate({ user_id: user.id, ...data });
    }
  };
  
  
  const route = useRoute();
  const { goalId } = route.params;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={styles.innerContainer}>
        <SharedForm
          title="Submit"
          placeholder="Enter your milestone..."
          value={description}
          setValue={setDescription}
          onPost={() => handlePost({ parent_id: goalId, description, is_completed: false })}
          navigation={navigation}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default CreateMilestone;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});