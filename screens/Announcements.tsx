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

  if (!goals || goals.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>
        Please go to the search tab to follow people, or create your own goals and see them here.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={goals.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())}
        renderItem={({ item }) => (
          <Announcement
            goal={item}
            reactions={reactions[item.id] || []}
            commentCount={commentCounts.find((count) => count.goal_id === item.id) || {goal_id: item.id, count: 0 }}
            />
        )}
        keyExtractor={(item) => item.id}
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
  noDataText: {
    textAlign: 'center',
    color: 'gray',
  },
});