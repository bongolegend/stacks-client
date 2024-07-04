import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { updateGoalCompletion, fetchGoalsByParent, fetchReactions, fetchCommentCounts } from '../services/api';
import { useRoute, useNavigation } from '@react-navigation/native';
import MilestoneItem from '../components/MilestoneItem';
import CompletionModal from '../components/CompletionModal';
import Interactions from '../components/Interactions';
import { GoalEnriched, Reaction, CommentCount } from '../types/requests';

interface GoalAndMilestonesProps {
  route: {
    params: {
      goal: GoalEnriched;
      reactions: Reaction[];
      commentCount: CommentCount;
    };
  };
}

const GoalAndMilestones: React.FC<GoalAndMilestonesProps> = () => {
  const { goal, reactions, commentCount } = useRoute().params as any;
  const queryClient = useQueryClient();
  const [selectedItem, setSelectedItem] = useState<GoalEnriched | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const { data: milestones, isLoading: milestonesLoading } = useQuery({
    queryKey: ['milestones', goal.id],
    queryFn: () => fetchGoalsByParent(goal.id),
    enabled: !!goal.id,
  });

  const { data: milestoneReactions, isLoading: reactionsLoading } = useQuery({
    queryKey: ['milestoneReactions', goal.id],
    queryFn: () => fetchReactions(milestones.map(m => m.id)),
    enabled: !!milestones,
  });

  const { data: milestoneCommentCounts, isLoading: commentCountsLoading } = useQuery({
    queryKey: ['milestoneCommentCounts', goal.id],
    queryFn: () => fetchCommentCounts(milestones.map(m => m.id)),
    enabled: !!milestones,
  });

  const goalMutation = useMutation({
    mutationFn: updateGoalCompletion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milestones', goal.id] });
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

  const handleCreateMilestone = () => {
    navigation.navigate('CreateMilestone', { goalId: goal.id });
  };

  if (milestonesLoading || reactionsLoading || commentCountsLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.goalContainer}>
        <Text style={styles.goalTitle}>{goal.title}</Text>
        <Text style={styles.goalDescription}>{goal.description}</Text>
        <Interactions goal={goal} reactions={reactions} commentCount={commentCount} />
      </View>
      <TouchableOpacity style={styles.createMilestoneButton} onPress={handleCreateMilestone}>
        <Text style={styles.createMilestoneButtonText}>+ Milestone</Text>
      </TouchableOpacity>
      <FlatList
        data={milestones?.filter(milestone => milestone.parent_id === goal.id)}
        renderItem={({ item }) => (
          <MilestoneItem
            milestone={item}
            onOpenModal={handleOpenModal}
            showButtons={true}
            reactions={milestoneReactions[item.id] || []}
            commentCount={milestoneCommentCounts.find(count => count.goal_id === item.id) || { goal_id: item.id, count: 0 }}
          />
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

export default GoalAndMilestones;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  goalContainer: {
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 16,
  },
  goalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  goalDescription: {
    fontSize: 16,
    color: 'gray',
  },
  createMilestoneButton: {
    backgroundColor: '#03A9F4',
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginTop: 8,
    marginBottom: 16,
  },
  createMilestoneButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 8,
  },
});