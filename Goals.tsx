import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchGoals, fetchMilestones, updateGoalCompletion } from './api';
import { useUser } from './UserContext';
import GoalItem from './GoalItem';
import CompletionModal from './CompletionModal';

interface Goal {
  id: string;
  user_id: string;
  description: string;
  is_completed: boolean;
  created_at: string;
}

interface Milestone {
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
  const [selectedItem, setSelectedItem] = useState<{ type: 'goal'; item: Goal } | null>(null);
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
    mutationFn: ({ goalId, is_completed }: { goalId: string; is_completed: boolean }) =>
      updateGoalCompletion({ goalId, is_completed }),
    onSuccess: () => {
      queryClient.invalidateQueries(['goals', user?.id]);
    },
  });

  const handleOpenModal = (item: Goal) => {
    setSelectedItem({ type: 'goal', item });
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  const handleToggleCompletion = () => {
    if (selectedItem) {
      const { item } = selectedItem;
      goalMutation.mutate({
        goalId: item.id,
        is_completed: !item.is_completed,
      });
      handleCloseModal();
    }
  };

  return (
    <View style={styles.container}>
      {goalsLoading || milestonesLoading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={goals}
          renderItem={({ item }) => (
            <GoalItem 
              goal={item} 
              milestones={milestones?.filter(milestone => milestone.goal_id === item.id)} 
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
