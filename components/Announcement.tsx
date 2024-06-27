// Filename: components/Announcement.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GoalEnriched } from '../types/requests';
import Interactions from './Interactions';

interface AnnouncementProps {
  item: GoalEnriched;
}

const Announcement: React.FC<AnnouncementProps> = ({ item }) => {
  const navigation = useNavigation();
  const goal = item;
  const parent = item.parent;

  const handlePress = () => {
    navigation.navigate('OtherUserGoals', { userId: item.user.id, enableEdits: false});
  };

  return (
    <View style={styles.postItem}>
      <View style={styles.postHeader}>
        <Text style={styles.username}>{item.user.username}</Text>
        <Text style={styles.updatedAt}>{new Date(goal.updated_at).toLocaleDateString()}</Text>
      </View>
      <TouchableOpacity onPress={handlePress} style={styles.contentContainer}>
        {goal.title && <Text style={styles.primaryTitle}>{goal.title}</Text>}
        {goal.due_date && <Text style={styles.primaryDueDate}>Due Date: {new Date(goal.due_date).toLocaleDateString()}</Text>}
        <Text style={styles.primaryDescription}>{goal.description}</Text>
        {parent && <Text style={styles.goalTitle}>Goal: {parent.title}</Text>}
      </TouchableOpacity>
      <Interactions item={item} />
    </View>
  );
};

const styles = StyleSheet.create({
  postItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  username: {
    fontWeight: 'bold',
  },
  updatedAt: {
    color: 'grey',
  },
  contentContainer: {
    marginBottom: 8,
  },
  primaryTitle: {
    fontWeight: 'bold',
    color: 'gray',
    marginBottom: 4,
  },
  primaryDueDate: {
    color: 'lightgray',
    marginBottom: 4,
  },
  primaryDescription: {
    marginTop: 4,
    marginBottom: 8,
  },
  goalTitle: {
    color: 'gray',
    marginTop: 8,
  },
});

export default Announcement;