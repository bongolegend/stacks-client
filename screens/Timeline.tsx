// Timeline.tsx
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { fetchTimeline } from './api';
import { useUser } from './UserContext';
import Post from './components/Post';

const Timeline: React.FC = () => {
  const { user } = useUser();

  const { data: posts, isLoading: timelineLoading } = useQuery({
    queryKey: ['timeline', user?.id],
    queryFn: () => fetchTimeline(user!.id),
    enabled: !!user,
  });

  return (
    <View style={styles.container}>
      {timelineLoading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={posts?.sort((a, b) => new Date(b.sort_on).getTime() - new Date(a.sort_on).getTime())}
          renderItem={({ item }) => <Post item={item} />}
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
});
