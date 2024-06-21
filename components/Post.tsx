import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import EmojiPicker, { EmojiType } from 'rn-emoji-keyboard';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addReactionToPost } from '../services/api';
import { useUser } from '../contexts/UserContext';
import { useNavigation } from '@react-navigation/native';
import { Post as PostType } from '../types/requests';

interface PostProps {
  item: PostType;
}

const Post: React.FC<PostProps> = ({ item }) => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);

  const primary = item.task || item.goal;

  const reactionMutation = useMutation({
    mutationFn: (emoji: EmojiType) => addReactionToPost(user?.id!, item, emoji),
    onSuccess: () => {
      queryClient.invalidateQueries(['timeline', user?.id]);
    },
  });

  const handleOpenEmojiPicker = () => {
    setEmojiPickerVisible(true);
  };

  const handleSelectEmoji = (emoji: EmojiType) => {
    reactionMutation.mutate(emoji);
    setEmojiPickerVisible(false);
  };

  const handleAddReaction = (emoji: EmojiType) => {
    reactionMutation.mutate(emoji);
  };

  const handleOpenComments = () => {
    navigation.navigate('CommentsScreen', { post: item });
  };

  // Group reactions by emoji
  const groupedReactions = item.reactions.reduce((acc: { [key: string]: number }, reaction) => {
    const emoji = reaction.reaction.emoji;
    if (!acc[emoji]) {
      acc[emoji] = 0;
    }
    acc[emoji]++;
    return acc;
  }, {});

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
      <View style={styles.reactionsContainer}>
        {Object.entries(groupedReactions).map(([emoji, count]) => (
          <TouchableOpacity key={emoji} style={styles.reactionButton} onPress={() => handleAddReaction({ emoji } as EmojiType)}>
            <Text style={styles.reactionText}>{emoji} {count > 1 ? count : ''}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity onPress={handleOpenEmojiPicker} style={styles.addReactionButton}>
          <Text style={styles.addReactionText}>:-) +</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={handleOpenComments} style={styles.commentButton}>
        <Text style={styles.commentButtonText}>{item.comments_count} Comments</Text>
      </TouchableOpacity>
      <EmojiPicker open={emojiPickerVisible} onClose={() => setEmojiPickerVisible(false)} onEmojiSelected={handleSelectEmoji} />
    </View>
  );
};

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
  reactionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  reactionButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 4,
    marginBottom: 4,
  },
  reactionText: {
    fontSize: 16,
  },
  addReactionButton: {
    backgroundColor: '#d3d3d3',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 4,
  },
  addReactionText: {
    fontSize: 16,
    color: 'darkgrey',
    fontWeight: 'bold',
  },
  commentButton: {
    backgroundColor: '#d3d3d3',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  commentButtonText: {
    fontSize: 16,
    color: 'darkgrey',
    fontWeight: 'bold',
  },
});