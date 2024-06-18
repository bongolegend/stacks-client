// Post.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PostProps {
  item: {
    id: string;
    user: {
      email: string;
      username: string;
      id: string;
      created_at: string;
      updated_at: string;
    };
    primary: {
      user_id: string;
      description: string;
      is_completed: boolean;
      id: string;
      created_at: string;
      updated_at: string;
    };
    secondary: {
      user_id: string;
      description: string;
      is_completed: boolean;
      id: string;
      created_at: string;
      updated_at: string;
    };
    sort_on: string;
    created_at: string;
  };
}

const Post: React.FC<PostProps> = ({ item }) => (
  <View style={styles.postItem}>
    <View style={styles.postHeader}>
      <Text style={styles.username}>{item.user.username}</Text>
      <Text style={styles.sortOn}>{new Date(item.sort_on).toLocaleDateString()}</Text>
    </View>
    <Text style={styles.description}>{item.primary.description}</Text>
  </View>
);

export default Post;

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
  sortOn: {
    color: 'grey',
  },
  description: {
    marginTop: 4,
  },
});
