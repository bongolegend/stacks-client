// Filename: screens/CreateMilestone.tsx
import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import SharedForm from '../components/SharedForm';
import useMutationHandlers from '../utils/useMutationHandlers';
import { createSubgoal } from '../services/api';
import { useNavigation, useRoute } from '@react-navigation/native';

const CreateSubgoal: React.FC = () => {
  const [description, setDescription] = useState<string>('');
  const handlePost = useMutationHandlers(createSubgoal, 'subgoals', 'Milestone Posted');
  const navigation = useNavigation();
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
          title="New Milestone"
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

export default CreateSubgoal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});