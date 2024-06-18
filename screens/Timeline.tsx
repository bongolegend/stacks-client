import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import EmojiPicker, { EmojiType } from 'rn-emoji-keyboard';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTimeline, addReactionToPost } from '../services/api';
import { useUser } from '../contexts/UserContext';
import Post from '../components/Post';

const Timeline: React.FC = () => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [selectedPost, setSelectedPost] = useState(null);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);

  const { data: posts, isLoading: timelineLoading } = useQuery({
    queryKey: ['timeline', user?.id],
    queryFn: () => fetchTimeline(user!.id),
    enabled: !!user,
  });

  const reactionMutation = useMutation({
    mutationFn: ({ postId, emoji }) => addReactionToPost(postId, emoji),
    onSuccess: () => {
      queryClient.invalidateQueries(['timeline', user?.id]);
    },
  });

  const handleOpenEmojiPicker = (post) => {
    setSelectedPost(post);
    setEmojiPickerVisible(true);
  };

  const handleSelectEmoji = (emoji: EmojiType) => {
    if (selectedPost) {
      reactionMutation.mutate({ postId: selectedPost.id, emoji: emoji });
      setEmojiPickerVisible(false);
      setSelectedPost(null);
    }
  };

  return (
    <View style={styles.container}>
      {timelineLoading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={posts}
          renderItem={({ item }) => (
            <View>
              <Post item={item} />
              <TouchableOpacity onPress={() => handleOpenEmojiPicker(item)}>
                <Text>Add Reaction</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      )}
        <View style={styles.emojiPickerContainer}>
          <EmojiPicker open={emojiPickerVisible} onClose={() => setEmojiPickerVisible(false)} onEmojiSelected={handleSelectEmoji} />
        </View>
    </View>
  );
};

export default Timeline;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  emojiPickerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
