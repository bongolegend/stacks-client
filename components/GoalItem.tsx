import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

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

interface GoalItemProps {
  goal: Goal;
  milestones: Milestone[];
  onOpenModal: (item: Goal) => void;
}

const GoalItem: React.FC<GoalItemProps> = ({ goal, milestones, onOpenModal }) => {
  const renderMilestoneItem = ({ item }: { item: Milestone }) => (
    <View style={styles.milestoneItem}>
      <View style={styles.milestoneTextContainer}>
        <Text style={[styles.milestoneDescription, , goal.is_completed && styles.completedText]}>{item.description}</Text>
        <Text style={[styles.milestoneDate, goal.is_completed && styles.completedText]}>{new Date(item.created_at).toLocaleDateString()}</Text>
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
          <Text style={[styles.goalDescription, goal.is_completed && styles.completedText]}>{goal.description}</Text>
          <Text style={[styles.goalDate, goal.is_completed && styles.completedText]}>{new Date(goal.created_at).toLocaleDateString()}</Text>
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
  goalDescription: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  milestoneDescription: {
    fontSize: 14,
  },
  goalDate: {
    fontSize: 12,
    color: 'gray',
    textAlign: 'right',
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
