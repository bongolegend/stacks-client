// Filename: components/GoalItem.tsx
import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Goal, Milestone } from '../types/requests';
import { useNavigation } from '@react-navigation/native';

interface GoalItemProps {
  goal: Goal;
  subgoals: Goal[];
  onOpenModal: (item: Goal ) => void;
}

const GoalItem: React.FC<GoalItemProps> = ({ goal, subgoals, onOpenModal }) => {
  const navigation = useNavigation();

  const renderMilestoneItem = ({ item }: { item: Goal }) => (
    <View style={styles.milestoneItem}>
      <TouchableOpacity
        style={[styles.completeButton, item.is_completed && styles.completedButton]}
        onPress={() => onOpenModal(item)}
      />
      <View style={styles.milestoneTextContainer}>
        <Text style={[styles.milestoneDescription, item.is_completed && styles.completedText]}>{item.description}</Text>
        <Text style={[styles.milestoneDate, item.is_completed && styles.completedText]}>{new Date(item.created_at).toLocaleDateString()}</Text>
      </View>
    </View>
  );

  const handleCreateMilestone = () => {
    navigation.navigate('CreateMilestone', { goalId: goal.id });
  };

  return (
    <View style={styles.goalItem}>
      <View style={styles.goalContent}>
        <TouchableOpacity
          style={[styles.completeButton, goal.is_completed && styles.completedButton]}
          onPress={() => onOpenModal(goal)}
        />
        <View style={styles.goalTextContainer}>
          <Text style={[styles.goalTitle, goal.is_completed && styles.completedText]}>{goal.title}</Text>
          {goal.due_date && (
            <Text style={styles.dueDate}>
              Due date: <Text style={styles.dueDateText}>{new Date(goal.due_date).toLocaleDateString()}</Text>
            </Text>
          )}
          <Text style={[styles.goalDescription, goal.is_completed && styles.completedText]}>{goal.description}</Text>
        </View>
      </View>
      <View style={styles.separator} />
      <FlatList
        data={subgoals}
        renderItem={renderMilestoneItem}
        keyExtractor={(milestone) => milestone.id}
        nestedScrollEnabled={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      <TouchableOpacity style={styles.createMilestoneButton} onPress={handleCreateMilestone}>
        <Text style={styles.createMilestoneButtonText}>+ Milestone</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GoalItem;

const styles = StyleSheet.create({
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
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 32,
    marginBottom: 8,
  },
  milestoneTextContainer: {
    marginLeft: 8,
    flex: 1,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dueDate: {
    fontSize: 12,
    color: 'darkgray',
    marginBottom: 4,
  },
  dueDateText: {
    color: 'darkgray',
  },
  goalDescription: {
    fontSize: 16,
  },
  milestoneDescription: {
    fontSize: 14,
  },
  milestoneDate: {
    fontSize: 12,
    color: 'gray',
    textAlign: 'right',
  },
  completeButton: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderColor: 'gray',
    borderWidth: 2,
    borderRadius: 5,
  },
  completedButton: {
    backgroundColor: '#8FBC8F',
    borderColor: '#006400',
    borderRadius: 5,
  },
  completedText: {
    color: 'darkgray',
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 8,
  },
  createMilestoneButton: {
    backgroundColor: '#d3d3d3',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginTop: 8,
    marginLeft: 32, // Align with milestone complete buttons
  },
  createMilestoneButtonText: {
    fontSize: 16,
    color: 'darkgrey',
    fontWeight: 'bold',
  },
});