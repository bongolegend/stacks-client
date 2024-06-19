import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import EmojiPicker, { EmojiType } from 'rn-emoji-keyboard';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addReactionToPost } from '../services/api';
import { useUser } from '../contexts/UserContext';
import { useNavigation } from '@react-navigation/native';

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
      table: string;
      created_at: string;
      updated_at: string;
    };
    reactions: {
      user_id: string;
      reaction: EmojiType;
      reaction_library: string;
      task_id: string;
      goal_id: string;
    }[];
    comments_count: number;
    sort_on: string;
    created_at: string;
  };
}

const Post: React.FC<PostProps> = ({ item }) => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);

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
        <Text style={styles.sortOn}>{new Date(item.sort_on).toLocaleDateString()}</Text>
      </View>
      <Text style={styles.description}>{item.primary.description}</Text>
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
        <Text style={styles.commentButtonText}>Comments ({item.comments_count})</Text>
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
  sortOn: {
    color: 'grey',
  },
  description: {
    marginTop: 4,
    marginBottom: 8,
  },
  reactionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center', // Align items vertically in the center
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
    alignSelf: 'flex-start', // Ensure the button is only as wide as the content
    marginTop: 8,
  },
  commentButtonText: {
    fontSize: 16,
    color: 'darkgrey',
    fontWeight: 'bold',
  },
});