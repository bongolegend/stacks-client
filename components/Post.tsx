import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Post as PostType } from '../types/requests';
import Interactions from './Interactions';

interface PostProps {
  item: PostType;
}

const Post: React.FC<PostProps> = ({ item }) => {
  const goal = item.goal;
  const parent = item.parent;

  return (
    <View style={styles.postItem}>
      <View style={styles.postHeader}>
        <Text style={styles.username}>{item.user.username}</Text>
        <Text style={styles.updatedAt}>{new Date(goal.updated_at).toLocaleDateString()}</Text>
      </View>
      {goal.title && <Text style={styles.primaryTitle}>{goal.title}</Text>}
      {goal.due_date && <Text style={styles.primaryDueDate}>Due Date: {new Date(goal.due_date).toLocaleDateString()}</Text>}
      <Text style={styles.primaryDescription}>{goal.description}</Text>
      {parent && <Text style={styles.goalTitle}>Goal: {parent.title}</Text>}
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

export default Post;