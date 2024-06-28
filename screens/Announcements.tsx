import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { fetchAnnouncements, fetchCommentCounts, fetchReactions } from '../services/api';
import { useUser } from '../contexts/UserContext';
import Announcement from '../components/Announcement';
import { GoalEnriched } from '../types/requests';

const Announcements: React.FC = () => {
  const { user } = useUser();

  const { data: goals, isLoading: isAnnouncementsLoading } = useQuery({
    queryKey: ['announcements', user?.id],
    queryFn: () => fetchAnnouncements(user!.id),
    enabled: !!user,
  });

  const goalIds = goals?.map((goal) => goal.id) || [];

  const { data: commentCounts, isLoading: isCommentCountsLoading } = useQuery({
    queryKey: ['commentCounts', 'announcements'],
    queryFn: () => fetchCommentCounts(goalIds!),
    enabled: !!goalIds.length,
  });

  const { data: reactions, isLoading: reactionsLoading } = useQuery({
    queryKey: ['reactions', 'announcements'],
    queryFn: () => fetchReactions(goalIds!),
    enabled: !!goalIds.length,
  });

  if (isAnnouncementsLoading || isCommentCountsLoading || reactionsLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!goals) {
    return (
      <View style={styles.container}>
        <Text>No data. Go to the Search Tab to follow people.</Text>
      </View>
    );
  }

  const combinedData = goals.map((goal) => {
    const reactionsForAnnouncement = reactions[goal.id];
    const commentCount = commentCounts.find((count) => count.goal_id === goal.id);
    return {
      goal,
      reactions: reactionsForAnnouncement ? reactionsForAnnouncement : [],
      commentCount: commentCount,
    };
  });

  return (
    <View style={styles.container}>
      <FlatList
        data={combinedData.sort((a, b) => new Date(b.goal.updated_at).getTime() - new Date(a.goal.updated_at).getTime())}
        renderItem={({ item }) => (
          <Announcement item={item} />
        )}
        keyExtractor={(item) => item.goal.id}
      />
    </View>
  );
};

export default Announcements;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
});