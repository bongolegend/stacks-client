// Goals.tsx
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchGoals, updateGoalCompletion } from './api';
import { useUser } from './UserContext';

interface Goal {
  id: string;
  user_id: string;
  description: string;
  is_completed: boolean;
  created_at: string;
}

const Goals: React.FC = () => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { data: goals, isLoading: goalsLoading } = useQuery({
    queryKey: ['goals', user?.id],
    queryFn: () => fetchGoals(user!.id),
    enabled: !!user,
  });

  const mutation = useMutation({
    mutationFn: ({ goalId, is_completed }: { goalId: string; is_completed: boolean }) => 
      updateGoalCompletion({ goalId, is_completed }),
    onSuccess: () => {
      queryClient.invalidateQueries(['goals', user?.id]);
    },
  });

  const handleOpenModal = (goal: Goal) => {
    setSelectedGoal(goal);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedGoal(null);
  };

  const handleToggleGoal = () => {
    if (selectedGoal) {
      mutation.mutate({
        goalId: selectedGoal.id,
        is_completed: !selectedGoal.is_completed,
      });
      handleCloseModal();
    }
  };

  const renderItem = ({ item }: { item: Goal }) => (
    <View style={styles.goalItem}>
      <TouchableOpacity
        style={[styles.completeButton, item.is_completed && styles.completedButton]}
        onPress={() => handleOpenModal(item)}
      />
      <View style={styles.goalTextContainer}>
        <Text style={styles.goalDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
        <Text style={styles.goalDescription}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {goalsLoading ? (
        <Text>Loading goals...</Text>
      ) : (
        <FlatList
          data={goals}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      )}
      {selectedGoal && (
        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="slide"
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>
                {selectedGoal.is_completed
                  ? 'Are you sure you want to un-mark this goal as complete?'
                  : 'Are you sure you want to mark this goal as complete?'}
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.cancelButton} onPress={handleCloseModal}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.confirmButton} onPress={handleToggleGoal}>
                  <Text style={styles.buttonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default Goals;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalTextContainer: {
    marginLeft: 8,
    flex: 1,
  },
  goalDescription: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  goalDate: {
    fontSize: 12,
    color: 'gray',
    textAlign: 'right',
  },
  completeButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc',
    borderRadius: 15, // Circle
  },
  completedButton: {
    backgroundColor: '#B0E57C', // Pastel green color
  },
  buttonText: {
    color: 'white',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    padding: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    marginRight: 10,
  },
  confirmButton: {
    padding: 10,
    backgroundColor: '#03A9F4',
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
  },
});
