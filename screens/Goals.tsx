import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchGoalsByUser, updateGoalCompletion, fetchFollowCounts, fetchUser, fetchReactions, fetchCommentCounts } from '../services/api';
import { useUser } from '../contexts/UserContext';
import GoalItem from '../components/GoalItem';
import MilestoneItem from '../components/MilestoneItem';
import CompletionModal from '../components/CompletionModal';
import { GoalEnriched } from '../types/requests';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

interface GoalsProps {
  route: {
    params: {
      userId: string;
      enableEdits: boolean;
    };
  };
}

const Goals: React.FC<GoalsProps> = ({ route }) => {
  const { userId, enableEdits } = route.params;
  const queryClient = useQueryClient();
  const [selectedItem, setSelectedItem] = useState<GoalEnriched | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const { data: displayedUser, isLoading: userLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    enabled: !!userId,
  });

  const { data: followCounts, isLoading: followCountsLoading } = useQuery({
    queryKey: ['followCounts', userId],
    queryFn: () => fetchFollowCounts(userId),
    enabled: !!userId,
  });

  const { data: goals, isLoading: goalsLoading } = useQuery({
    queryKey: ['goals', userId],
    queryFn: () => fetchGoalsByUser(userId),
    enabled: !!userId,
  });

  const goalIds = goals?.map((goal) => goal.id) || [];

  const { data: reactions, isLoading: reactionsLoading } = useQuery({
    queryKey: ['reactions', 'goals'],
    queryFn: () => fetchReactions(goalIds),
    enabled: !!goalIds.length,
  });

  const { data: commentCounts, isLoading: commentCountsLoading } = useQuery({
    queryKey: ['commentCounts', 'goals'],
    queryFn: () => fetchCommentCounts(goalIds),
    enabled: !!goalIds.length,
  });

  const goalMutation = useMutation({
    mutationFn: updateGoalCompletion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals', userId] });
      queryClient.invalidateQueries({queryKey: ['announcements']});
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
  const handleCreateMilestone = (goalId: string) => {
    navigation.navigate('CreateMilestone', { goalId });
  };


  const stats = useMemo(() => {
    if (!goals) return { activeGoals: 0, completedGoals: 0, activeMilestones: 0, completedMilestones: 0 };

    const activeGoals = goals.filter(goal => !goal.is_completed && goal.parent_id === null).length;
    const completedGoals = goals.filter(goal => goal.is_completed && goal.parent_id === null).length;
    const activeMilestones = goals.filter(goal => !goal.is_completed && goal.parent_id !== null).length;
    const completedMilestones = goals.filter(goal => goal.is_completed && goal.parent_id !== null).length;

    return { activeGoals, completedGoals, activeMilestones, completedMilestones };
  }, [goals]);

  if (userLoading || goalsLoading || reactionsLoading || commentCountsLoading || followCountsLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
        <FlatList
          ListHeaderComponent={
            <View style={styles.header}>
              <Text style={styles.username}>{displayedUser?.username}</Text>
              <Text style={styles.joinedDate}>Joined on {new Date(displayedUser?.created_at).toLocaleDateString()}</Text>
              <Text style={styles.followCounts}>{followCounts?.followers} Followers    {followCounts?.leaders} Following</Text>
              <Text style={styles.stats}>Active Goals: {stats.activeGoals}</Text>
              <Text style={styles.stats}>Completed Goals: {stats.completedGoals}</Text>
              <Text style={styles.stats}>Active Milestones: {stats.activeMilestones}</Text>
              <Text style={styles.stats}>Completed Milestones: {stats.completedMilestones}</Text>
            </View>
          }
          data={goals?.filter(goal => goal.parent_id === null
            ).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            ).sort((a, b) => Number(a.is_completed) - Number(b.is_completed))}
          renderItem={({ item }) => (
            <View>
              <GoalItem 
                goal={item} 
                onOpenModal={handleOpenModal}
                showButtons={enableEdits}
                reactions={reactions[item.id] || []}
                commentCount={commentCounts.find(count => count.goal_id === item.id) || { goal_id: item.id, count: 0 }}
              />
              <FlatList
                data={goals.filter(goal => goal.parent_id === item.id)}
                renderItem={({ item: milestone }) => (
                  <MilestoneItem
                    milestone={milestone}
                    onOpenModal={handleOpenModal}
                    showButtons={enableEdits}
                    reactions={reactions[milestone.id] || []}
                    commentCount={commentCounts.find(count => count.goal_id === milestone.id) || { goal_id: milestone.id, count: 0 }}
                  />
                )}
                keyExtractor={(milestone) => milestone.id}
                nestedScrollEnabled={false}
                ListFooterComponent={
                  enableEdits && (
                  <TouchableOpacity style={styles.createMilestoneButton} onPress={() => handleCreateMilestone(item.id)}>
                    <Text style={styles.createMilestoneButtonText}>+ Milestone</Text>
                  </TouchableOpacity>)}
                />
            </View>
          )}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
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
    backgroundColor: 'white',
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
  followCounts: {
    fontSize: 16,
    color: 'grey',
    textAlign: 'center',
    alignSelf: 'stretch',
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
  createMilestoneButton: {
    backgroundColor: '#03A9F4',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginTop: 8,
    marginLeft: 32,
    },
    createMilestoneButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    },
});