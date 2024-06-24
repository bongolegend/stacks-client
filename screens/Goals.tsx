import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchGoals, fetchSubGoals, updateGoalCompletion, updateTaskCompletion } from '../services/api';
import { useUser } from '../contexts/UserContext';
import GoalItem from '../components/GoalItem';
import CompletionModal from '../components/CompletionModal';
import { Goal } from '../types/requests';


const Goals: React.FC = () => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [selectedItem, setSelectedItem] = useState<Goal | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { data: goals, isLoading: goalsLoading } = useQuery({
    queryKey: ['goals', user?.id],
    queryFn: () => fetchGoals(user!.id),
    enabled: !!user,
  });

  // const { data: subgoals, isLoading: subgoalsLoading } = useQuery({
  //   queryKey: ['subgoals', user?.id],
  //   queryFn: () => fetchSubGoals(user!.id),
  //   enabled: !!user,
  // });

  const goalMutation = useMutation({
    mutationFn: updateGoalCompletion,
    onSuccess: () => {
      queryClient.invalidateQueries(['goals', user?.id]);
    },
  });

  // const subgoalMutation = useMutation({
  //   mutationFn: updateTaskCompletion,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries(['subgoals', user?.id]);
  //   },
  // });

  const handleOpenModal = (item: Goal ) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  const handleToggleCompletion = () => {
    if (selectedItem) {
      goalMutation.mutate({
        id: selectedItem.id,
        is_completed: !selectedItem.is_completed,
      });
      handleCloseModal();
    }
  };

  // const handleMilestoneToggle = (milestone: Milestone) => {
  //   subgoalMutation.mutate({
  //     taskId: milestone.id,
  //     is_completed: !milestone.is_completed,
  //   });
  // };

  return (
    <View style={styles.container}>
      {goalsLoading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={goals?.filter(goal => goal.parent_id === null
          ).sort((a, b) => a.is_completed - b.is_completed)}
          renderItem={({ item }) => (
            <GoalItem 
              goal={item} 
              subgoals={goals?.filter(goal => goal.parent_id === item.id)} 
              onOpenModal={handleOpenModal}
            />
          )}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
      {selectedItem && (
        <CompletionModal
          visible={modalVisible}
          item={selectedItem}
          onClose={handleCloseModal}
          onConfirm={handleToggleCompletion}
        />
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
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 8,
  },
});