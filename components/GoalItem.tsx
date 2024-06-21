import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Goal, Milestone } from '../types/requests';


interface GoalItemProps {
  goal: Goal;
  milestones: Milestone[];
  onOpenModal: (item: Goal | Milestone) => void;
  // onMilestoneToggle: (milestone: Milestone) => void;
}

const GoalItem: React.FC<GoalItemProps> = ({ goal, milestones, onOpenModal }) => {
  const renderMilestoneItem = ({ item }: { item: Milestone }) => (
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
        data={milestones}
        renderItem={renderMilestoneItem}
        keyExtractor={(milestone) => milestone.id}
        nestedScrollEnabled={true}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
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
    backgroundColor: '#e0e0e0', // Darker gray background
    borderColor: 'gray',
    borderWidth: 2,
    borderRadius: 5, // Rounded edges
  },
  completedButton: {
    backgroundColor: '#8FBC8F', // Darker green background
    borderColor: '#006400',
    borderRadius: 5, // Rounded edges
  },
  completedText: {
    color: 'darkgray', // Dark gray color for completed text
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 8,
  },
});