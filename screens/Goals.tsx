// Filename: screens/Goals.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchGoals, updateGoalCompletion, fetchFollowCounts } from '../services/api';
import { useUser } from '../contexts/UserContext';
import GoalItem from '../components/GoalItem';
import CompletionModal from '../components/CompletionModal';
import { GoalEnriched, FollowCounts } from '../types/requests';

const Goals: React.FC = () => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [selectedItem, setSelectedItem] = useState<GoalEnriched | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [followCounts, setFollowCounts] = useState<FollowCounts>(FollowCounts.parse({ followers: 0, leaders: 0 }));

  const { data: goals, isLoading: goalsLoading } = useQuery({
    queryKey: ['goals', user?.id],
    queryFn: () => fetchGoals(user!.id),
    enabled: !!user,
  });

  useEffect(() => {
    if (user) {
      fetchFollowCounts(user.id).then(counts => setFollowCounts(counts));
    }
  }, [user]);

  const goalMutation = useMutation({
    mutationFn: updateGoalCompletion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals', user?.id] });
    },
  });

  const handleOpenModal = (item: GoalEnriched) => {
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

  const stats = useMemo(() => {
    if (!goals) return { activeGoals: 0, completedGoals: 0, activeMilestones: 0, completedMilestones: 0 };
    
    const activeGoals = goals.filter(goal => !goal.is_completed && goal.parent_id === null).length;
    const completedGoals = goals.filter(goal => goal.is_completed && goal.parent_id === null).length;
    const activeMilestones = goals.filter(goal => !goal.is_completed && goal.parent_id !== null).length;
    const completedMilestones = goals.filter(goal => goal.is_completed && goal.parent_id !== null).length;

    return { activeGoals, completedGoals, activeMilestones, completedMilestones };
  }, [goals]);

  return (
    <View style={styles.container}>
      {goalsLoading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          ListHeaderComponent={
            <View style={styles.header}>
              <Text style={styles.username}>{user?.username}</Text>
              <Text style={styles.joinedDate}>Joined on {new Date(user?.created_at).toLocaleDateString()}</Text>
              <Text style={styles.followStats}>{followCounts.followers} Followers     {followCounts.leaders} Following</Text>
              <Text style={styles.stats}>Active Goals: {stats.activeGoals}</Text>
              <Text style={styles.stats}>Completed Goals: {stats.completedGoals}</Text>
              <Text style={styles.stats}>Active Milestones: {stats.activeMilestones}</Text>
              <Text style={styles.stats}>Completed Milestones: {stats.completedMilestones}</Text>
            </View>
          }
          data={goals?.filter(goal => goal.parent_id === null
          ).sort((a, b) => Number(a.is_completed) - Number(b.is_completed))}
          renderItem={({ item }) => (
            <GoalItem 
              goal={item} 
              milestones={goals?.filter(goal => goal.parent_id === item.id)} 
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
  header: {
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    alignSelf: 'stretch',
  },
  joinedDate: {
    fontSize: 16,
    textAlign: 'center',
    alignSelf: 'stretch',
    color: 'grey',
    marginBottom: 8,
  },
  followStats: {
    fontSize: 16,
    textAlign: 'center',
    alignSelf: 'stretch',
    color: 'grey',
    marginBottom: 8,
  },
  stats: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 4,
    marginTop: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 8,
  },
});