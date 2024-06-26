import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Button, KeyboardAvoidingView, Platform } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchComments, addComment, updateUnreadComments } from '../services/api';
import { useUser } from '../contexts/UserContext';
import { Announcement, CommentEnriched, GoalEnriched } from '../types/requests';

interface CommentsProps {
  route: {
    params: {
      goal: GoalEnriched;
    };
  };
}

const Comments: React.FC<CommentsProps> = ({ route }) => {
  const { goal: goal } = route.params;
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState('');

  const parent = goal.parent;


  const { data: comments } = useQuery({
    queryKey: ['comments', goal.id],
    queryFn: async () => {
      const comments = await fetchComments(goal.id);
      const ids = comments.map((comment) => comment.id);
      updateUnreadComments(user?.id, ids).then(() => {
        queryClient.invalidateQueries({ queryKey: ['unreadCommentCount'] });
        queryClient.invalidateQueries({ queryKey: ['unreadComments'] });
      });
      return comments;
    },
    initialData: []
  });

  const commentMutation = useMutation({
    mutationFn: addComment,
    onSuccess: () => {
      setCommentText('');
      queryClient.invalidateQueries({queryKey: ['comments', goal.id]});
      queryClient.invalidateQueries({queryKey: ['commentCounts']});
    },
  });

  const handleAddComment = () => {
    commentMutation.mutate({ goal_id: goal.id, user_id: user!.id, comment: commentText });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.postHeader}>
        <View style={styles.postHeaderRow}>
          <Text style={styles.username}>{goal.user.username}</Text>
          <Text style={styles.timestamp}>{new Date(goal.updated_at).toLocaleDateString()}</Text>
        </View>
        {goal.title && <Text style={styles.primaryTitle}>{goal.title}</Text>}
        {goal.due_date && <Text style={styles.primaryDueDate}>Due Date: {new Date(goal.due_date).toLocaleDateString()}</Text>}
        <Text style={styles.description}>{goal.description}</Text>
        {parent && <Text style={styles.goalTitle}>Goal: {parent.title}</Text>}
      </View>
      <FlatList
        data={comments.sort((a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime())}
        renderItem={({ item }) => (
          <View style={styles.commentItem}>
            <View style={styles.commentHeader}>
              <Text style={styles.commentUserId}>{item.user.username}</Text>
              <Text style={styles.commentTimestamp}>{new Date(item.created_at).toLocaleDateString()}</Text>
            </View>
            <Text style={styles.commentText}>{item.comment}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        style={styles.commentsList}
      />
      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInput}
          value={commentText}
          onChangeText={setCommentText}
          placeholder="Add a comment..."
        />
        <Button title="Post" onPress={handleAddComment} disabled={!commentText.trim()} />
      </View>
    </KeyboardAvoidingView>
  );
};

export default Comments;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  postHeader: {
    marginBottom: 16,
  },
  postHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  username: {
    fontWeight: 'bold',
  },
  description: {
    marginTop: 4,
  },
  timestamp: {
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
  goalTitle: {
    color: 'gray',
    marginTop: 8,
  },
  commentsList: {
    flex: 1,
  },
  commentItem: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  commentUserId: {
    fontWeight: 'bold',
  },
  commentText: {
    marginTop: 4,
    marginBottom: 4,
  },
  commentTimestamp: {
    color: 'grey',
    fontSize: 12,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
  },
});