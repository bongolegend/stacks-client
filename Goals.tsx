// Goals.tsx
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchGoals, fetchTasks, updateGoalCompletion, updateTaskCompletion } from './api';
import { useUser } from './UserContext';

interface Goal {
  id: string;
  user_id: string;
  description: string;
  is_completed: boolean;
  created_at: string;
}

interface Task {
  id: string;
  user_id: string;
  goal_id: string;
  description: string;
  is_completed: boolean;
  created_at: string;
}

const Goals: React.FC = () => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [selectedItem, setSelectedItem] = useState<{ type: 'goal' | 'task'; item: Goal | Task } | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { data: goals, isLoading: goalsLoading } = useQuery({
    queryKey: ['goals', user?.id],
    queryFn: () => fetchGoals(user!.id),
    enabled: !!user,
  });

  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks', user?.id],
    queryFn: () => fetchTasks(user!.id),
    enabled: !!user,
  });

  const goalMutation = useMutation({
    mutationFn: ({ goalId, is_completed }: { goalId: string; is_completed: boolean }) =>
      updateGoalCompletion({ goalId, is_completed }),
    onSuccess: () => {
      queryClient.invalidateQueries(['goals', user?.id]);
    },
  });

  const taskMutation = useMutation({
    mutationFn: ({ taskId, is_completed }: { taskId: string; is_completed: boolean }) =>
      updateTaskCompletion({ taskId, is_completed }),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks', user?.id]);
    },
  });

  const handleOpenModal = (type: 'goal' | 'task', item: Goal | Task) => {
    setSelectedItem({ type, item });
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  const handleToggleCompletion = () => {
    if (selectedItem) {
      const { type, item } = selectedItem;
      if (type === 'goal') {
        goalMutation.mutate({
          goalId: (item as Goal).id,
          is_completed: !(item as Goal).is_completed,
        });
      } else if (type === 'task') {
        taskMutation.mutate({
          taskId: (item as Task).id,
          is_completed: !(item as Task).is_completed,
        });
      }
      handleCloseModal();
    }
  };

  const renderTaskItem = ({ item }: { item: Task }) => (
    <View style={styles.taskItem}>
      <TouchableOpacity
        style={[styles.taskCompleteButton, item.is_completed && styles.completedButton]}
        onPress={() => handleOpenModal('task', item)}
      />
      <View style={styles.taskTextContainer}>
        <Text style={styles.taskDescription}>{item.description}</Text>
        <Text style={styles.taskDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
      </View>
    </View>
  );

  const renderItem = ({ item }: { item: Goal }) => (
    <View style={styles.goalItem}>
      <View style={styles.goalContent}>
        <TouchableOpacity
          style={[styles.completeButton, item.is_completed && styles.completedButton]}
          onPress={() => handleOpenModal('goal', item)}
        />
        <View style={styles.goalTextContainer}>
          <Text style={styles.goalDescription}>{item.description}</Text>
          <Text style={styles.goalDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
        </View>
      </View>
      <View style={styles.separator} />
      <FlatList
        data={tasks?.filter(task => task.goal_id === item.id)}
        renderItem={renderTaskItem}
        keyExtractor={(task) => task.id}
        nestedScrollEnabled={true}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {goalsLoading || tasksLoading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={goals}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
      {selectedItem && (
        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="slide"
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>
                {selectedItem.item.is_completed
                  ? `Are you sure you want to un-mark this ${selectedItem.type} as complete?`
                  : `Are you sure you want to mark this ${selectedItem.type} as complete?`}
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.cancelButton} onPress={handleCloseModal}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.confirmButton} onPress={handleToggleCompletion}>
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
    marginBottom: 16,
  },
  goalContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalTextContainer: {
    marginLeft: 8,
    flex: 1,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 32, // Indent the task items
    marginBottom: 8,
  },
  taskTextContainer: {
    marginLeft: 8,
    flex: 1,
  },
  goalDescription: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskDescription: {
    fontSize: 14,
  },
  goalDate: {
    fontSize: 12,
    color: 'gray',
    textAlign: 'right',
  },
  taskDate: {
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
  taskCompleteButton: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc',
    borderRadius: 10, // Smaller circle
  },
  completedButton: {
    backgroundColor: '#B0E57C', // Pastel green color
  },
  buttonText: {
    color: 'white',
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 8,
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
