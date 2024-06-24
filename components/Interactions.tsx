import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import EmojiPicker, { EmojiType } from 'rn-emoji-keyboard';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addReaction } from '../services/api';
import { useUser } from '../contexts/UserContext';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Post } from '../types/requests';

interface InteractionsProps {
  item: Post;
}

const Interactions: React.FC<InteractionsProps> = ({ item }) => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);

  const reactionMutation = useMutation({
    mutationFn: (emoji: EmojiType) => addReaction(user?.id!, item.id, emoji),
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
    <View>
      <View style={styles.reactionsContainer}>
        {Object.entries(groupedReactions).map(([emoji, count]) => (
          <TouchableOpacity key={emoji} style={styles.reactionButton} onPress={() => handleAddReaction({ emoji } as EmojiType)}>
            <Text style={styles.reactionText}>{emoji} {count > 1 ? count : ''}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={handleOpenEmojiPicker} style={styles.transparentButton}>
          <FontAwesome5 name="smile" size={18} color="grey" />
          <Text> </Text>
          <FontAwesome5 name="plus" size={12} color="grey" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleOpenComments} style={styles.transparentButton}>
          <FontAwesome5 name="comment-alt" size={18} color="grey" />
          <Text style={styles.commentCount}>{item.comments_count}</Text>
        </TouchableOpacity>
      </View>
      <EmojiPicker open={emojiPickerVisible} onClose={() => setEmojiPickerVisible(false)} onEmojiSelected={handleSelectEmoji} />
    </View>
  );
};
const styles = StyleSheet.create({
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
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 8,
      width: '50%',
    },
    transparentButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'transparent',
      flex: 1,
    },
    commentCount: {
      fontSize: 16,
      color: 'grey',
      marginLeft: 4,
    },
  });

export default Interactions;