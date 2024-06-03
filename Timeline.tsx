// Timeline.tsx
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { fetchTimeline } from './api';
import { useUser } from './UserContext';

interface Post {
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
}

const Timeline: React.FC = () => {
  const { user } = useUser();

  const { data: posts, isLoading: timelineLoading } = useQuery({
    queryKey: ['timeline', user?.id],
    queryFn: () => fetchTimeline(user!.id),
    enabled: !!user,
  });

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postItem}>
      <View style={styles.postHeader}>
        <Text style={styles.username}>{item.user.username}</Text>
        <Text style={styles.sortOn}>{new Date(item.sort_on).toLocaleDateString()}</Text>
      </View>
      <Text style={styles.description}>{item.primary.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {timelineLoading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={posts?.sort((a, b) => new Date(b.sort_on).getTime() - new Date(a.sort_on).getTime())}
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

export default Timeline;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
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
