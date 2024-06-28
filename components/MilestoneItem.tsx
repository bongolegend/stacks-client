import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GoalEnriched, Reaction, CommentCount } from '../types/requests';
import Interactions from '../components/Interactions';

interface MilestoneItemProps {
  milestone: GoalEnriched;
  onOpenModal: (item: GoalEnriched) => void;
  showButtons: boolean;
  reactions: Reaction[];
  commentCount: CommentCount;
}

const MilestoneItem: React.FC<MilestoneItemProps> = ({ milestone, onOpenModal, showButtons, reactions, commentCount }) => {

  return (
    <View style={styles.milestoneItem}>
      {showButtons && (
        <TouchableOpacity
          style={[styles.completeButton, milestone.is_completed && styles.completedButton]}
          onPress={() => onOpenModal(milestone)}
        />
      )}
      <View style={styles.milestoneTextContainer}>
        <Text style={[styles.milestoneDescription, milestone.is_completed && styles.completedText]}>{milestone.description}</Text>
        <Text style={[styles.milestoneDate, milestone.is_completed && styles.completedText]}>{new Date(milestone.created_at).toLocaleDateString()}</Text>
        <Interactions goal={milestone} reactions={reactions} commentCount={commentCount} />
      </View>
    </View>
  );
};

export default MilestoneItem;

const styles = StyleSheet.create({
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
  milestoneDescription: {
    fontSize: 16,
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