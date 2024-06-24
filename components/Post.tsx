import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Post as PostType } from '../types/requests';
import Interactions from './Interactions';

interface PostProps {
  item: PostType;
}

const Post: React.FC<PostProps> = ({ item }) => {
  const primary = item.task || item.goal;

  return (
    <View style={styles.postItem}>
      <View style={styles.postHeader}>
        <Text style={styles.username}>{item.user.username}</Text>
        <Text style={styles.updatedAt}>{new Date(primary.updated_at).toLocaleDateString()}</Text>
      </View>
      {primary.title && <Text style={styles.primaryTitle}>{primary.title}</Text>}
      {primary.due_date && <Text style={styles.primaryDueDate}>Due Date: {new Date(primary.due_date).toLocaleDateString()}</Text>}
      <Text style={styles.primaryDescription}>{primary.description}</Text>
      {item.task && <Text style={styles.goalTitle}>Goal: {item.goal.title}</Text>}
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