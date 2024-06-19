import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import EmojiPicker, { EmojiType } from 'rn-emoji-keyboard';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addReactionToPost } from '../services/api';
import { useUser } from '../contexts/UserContext';

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
    secondary: {
      user_id: string;
      description: string;
      is_completed: boolean;
      id: string;
      table: string;
      created_at: string;
      updated_at: string;
    };
    sort_on: string;
    created_at: string;
  };
}

const Post: React.FC<PostProps> = ({ item }) => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);

  const reactionMutation = useMutation({
    mutationFn: ({ post, emoji }: { post: PostProps['item'], emoji: EmojiType }) => addReactionToPost(user?.id!, post, emoji),
    onSuccess: () => {
      queryClient.invalidateQueries(['timeline', user?.id]);
    },
  });

  const handleOpenEmojiPicker = () => {
    setEmojiPickerVisible(true);
  };

  const handleSelectEmoji = (emoji: EmojiType) => {
    reactionMutation.mutate({ post: item, emoji });
    setEmojiPickerVisible(false);
  };

  return (
    <View style={styles.postItem}>
      <View style={styles.postHeader}>
        <Text style={styles.username}>{item.user.username}</Text>
        <Text style={styles.sortOn}>{new Date(item.sort_on).toLocaleDateString()}</Text>
      </View>
      <Text style={styles.description}>{item.primary.description}</Text>
      <TouchableOpacity onPress={handleOpenEmojiPicker}>
        <Text>Add Reaction</Text>
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
  },
});
