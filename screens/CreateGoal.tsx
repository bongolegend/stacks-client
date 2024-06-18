// CreateGoal.tsx
import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import SharedForm from '../components/SharedForm';
import useMutationHandlers from '../utils/useMutationHandlers';
import { createGoal } from '../services/api';
import { useNavigation } from '@react-navigation/native';

const CreateGoal: React.FC = () => {
  const [description, setDescription] = useState<string>('');
  const handlePost = useMutationHandlers(createGoal, 'goals', 'Goal Posted');
  const navigation = useNavigation();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0} // Adjust offset if necessary
    >
      <View style={styles.innerContainer}>
        <SharedForm
          title="Post"
          placeholder="Enter your goal..."
          value={description}
          setValue={setDescription}
          onPost={() => handlePost({ description, is_completed: false })}
          navigation={navigation}
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
  innerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});
