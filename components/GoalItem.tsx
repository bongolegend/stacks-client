import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GoalEnriched, Reaction, CommentCount } from '../types/requests';
import Interactions from '../components/Interactions';

interface GoalItemProps {
  goal: GoalEnriched;
  onOpenModal: (item: GoalEnriched) => void;
  showButtons: boolean;
  reactions: Reaction[];
  commentCount: CommentCount;
}

const GoalItem: React.FC<GoalItemProps> = ({ goal, onOpenModal, showButtons, reactions, commentCount }) => {

  return (
    <View style={styles.goalItem}>
      <View style={styles.goalContent}>
        {showButtons && (
          <TouchableOpacity
            style={[styles.completeButton, goal.is_completed && styles.completedButton]}
            onPress={() => onOpenModal(goal)}
          />
        )}
        <View style={styles.goalTextContainer}>
          <Text style={[styles.goalTitle, goal.is_completed && styles.completedText]}>{goal.title}</Text>
          {goal.due_date && (
            <Text style={styles.dueDate}>
              Due date: <Text style={styles.dueDateText}>{new Date(goal.due_date).toLocaleDateString()}</Text>
            </Text>
          )}
          <Text style={[styles.goalDescription, goal.is_completed && styles.completedText]}>{goal.description}</Text>
          <Interactions goal={goal} reactions={reactions} commentCount={commentCount} />
        </View>
      </View>
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
  completeButton: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderColor: 'gray',
    borderWidth: 2,
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  completedButton: {
    backgroundColor: '#8FBC8F',
    borderColor: '#006400',
    borderRadius: 5,
  },
  completedText: {
    color: 'darkgray',
  },
});