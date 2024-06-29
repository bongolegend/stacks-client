import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchUnreadComments, fetchGoals, updateUnreadComments } from '../services/api';
import { useUser } from '../contexts/UserContext';
import { useNavigation } from '@react-navigation/native';

const Notifications: React.FC = () => {
  const { user } = useUser();
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const { data: comments, isLoading, error } = useQuery({
    queryKey: ['unreadComments', user.id],
    queryFn: () => fetchUnreadComments(user.id),
    enabled: !!user.id,
  });

  const mutation = useMutation({
    mutationFn: (comment_ids) => updateUnreadComments(user.id, comment_ids),
    onSuccess: () => {
      queryClient.invalidateQueries(['unreadComments']);
      queryClient.invalidateQueries(['unreadCommentCount']);
    },
  });

  const markAllRead = () => {
    if (comments) {
      const commentIds = comments.map(comment => comment.id);
      mutation.mutate(commentIds);
    }
  };

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error loading comments</Text>;

  const groupedComments = comments.reduce((groups, comment) => {
    if (!comment) return groups;
    const { goal_id } = comment;
    groups[goal_id] = groups[goal_id] || [];
    groups[goal_id].push(comment);
    return groups;
  }, {});

  const latestComments = Object.values(groupedComments).map(group => {
    return group.reduce((latest, comment) => 
      new Date(comment.updated_at) > new Date(latest.updated_at) ? comment : latest
    );
  }).sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

  const handlePress = async (goal_id) => {
    try {
      const goals = await fetchGoals([goal_id]);
      if (goals && goals.length) {
        navigation.navigate('Comments', { goal: goals[0] });
      }
    } catch (err) {
      console.error('Error fetching goals:', err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.markAllReadButton} onPress={markAllRead}>
          <Text style={styles.markAllReadButtonText}>Mark All Read</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={latestComments}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePress(item.goal_id)} style={styles.item}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{groupedComments[item.goal_id].length}</Text>
            </View>
            <View style={styles.commentContainer}>
              <Text style={styles.username}>{item.user.username}</Text>
              <Text>{item.comment}</Text>
            </View>
            <Text style={styles.date}>{new Date(item.updated_at).toLocaleDateString()}</Text>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
  },
  markAllReadButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderColor: 'lightgrey',
    borderWidth: 2,
  },
  markAllReadButtonText: {
    color: 'grey',
    fontWeight: 'bold',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
  },
  badge: {
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  badgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  commentContainer: {
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
  },
  date: {
    color: 'gray',
  },
  separator: {
    height: 1,
    backgroundColor: 'lightgray',
  },
});

export default Notifications;