import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchGoals, fetchMilestones, updateGoalCompletion, updateTaskCompletion } from '../services/api';
import { useUser } from '../contexts/UserContext';
import GoalItem from '../components/GoalItem';
import CompletionModal from '../components/CompletionModal';
import { Goal, Milestone } from '../types/requests';
import { BRAND } from 'zod';


const Goals: React.FC = () => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [selectedItem, setSelectedItem] = useState<Goal | Milestone | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { data: goals, isLoading: goalsLoading } = useQuery({
    queryKey: ['goals', user?.id],
    queryFn: () => fetchGoals(user!.id),
    enabled: !!user,
  });

  const { data: milestones, isLoading: milestonesLoading } = useQuery({
    queryKey: ['milestones', user?.id],
    queryFn: () => fetchMilestones(user!.id),
    enabled: !!user,
  });

  const goalMutation = useMutation({
    mutationFn: updateGoalCompletion,
    onSuccess: () => {
      queryClient.invalidateQueries(['goals', user?.id]);
    },
  });

  const milestoneMutation = useMutation({
    mutationFn: updateTaskCompletion,
    onSuccess: () => {
      queryClient.invalidateQueries(['milestones', user?.id]);
    },
  });

  const handleOpenModal = (item: Goal | Milestone) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  const handleToggleCompletion = () => {
    if (selectedItem) {
      const mutationFn = Goal.safeParse(selectedItem).success ? goalMutation : milestoneMutation;
      mutationFn.mutate({
        id: selectedItem.id,
        is_completed: !selectedItem.is_completed,
      });
      handleCloseModal();
    }
  };

  const handleMilestoneToggle = (milestone: Milestone) => {
    milestoneMutation.mutate({
      taskId: milestone.id,
      is_completed: !milestone.is_completed,
    });
  };

  return (
    <View style={styles.container}>
      {goalsLoading || milestonesLoading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={goals?.sort((a, b) => a.is_completed - b.is_completed)}
          renderItem={({ item }) => (
            <GoalItem 
              goal={item} 
              milestones={milestones?.filter(milestone => milestone.goal_id === item.id)} 
              onOpenModal={handleOpenModal} 
              onMilestoneToggle={handleMilestoneToggle}
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