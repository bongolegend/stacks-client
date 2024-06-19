import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Button, KeyboardAvoidingView, Platform } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCommentsForPost, addCommentToPost } from '../services/api';
import { useUser } from '../contexts/UserContext';

interface CommentsScreenProps {
  route: {
    params: {
      post: {
        id: string;
        user: {
          username: string;
        };
        primary: {
          description: string;
          table: string;
          id: string;
          created_at: string;
        };
        created_at: string;
      };
    };
  };
}

const CommentsScreen: React.FC<CommentsScreenProps> = ({ route }) => {
  const { post } = route.params;
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState('');

  const { data: comments, refetch } = useQuery({
    queryKey: ['postComments', post.id],
    queryFn: () => fetchCommentsForPost(post),
    initialData: [],
  });

  const commentMutation = useMutation({
    mutationFn: (newComment: { post: any; userId: string; comment: string }) =>
      addCommentToPost(newComment),
    onSuccess: () => {
      refetch();
      setCommentText('');
    },
  });

  const handleAddComment = () => {
    commentMutation.mutate({ post, userId: user!.id, comment: commentText });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.postHeader}>
        <Text style={styles.username}>{post.user.username}</Text>
        <Text style={styles.description}>{post.primary.description}</Text>
        <Text style={styles.timestamp}>{new Date(post.primary.created_at).toLocaleDateString()}</Text>
      </View>
      <FlatList
        data={comments}
        renderItem={({ item }) => (
          <View style={styles.commentItem}>
            <View style={styles.commentHeader}>
              <Text style={styles.commentUserId}>{item.user_id}</Text>
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

export default CommentsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  postHeader: {
    marginBottom: 16,
  },
  username: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    marginBottom: 4,
  },
  timestamp: {
    color: 'grey',
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