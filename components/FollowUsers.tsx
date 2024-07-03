import React from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { followUser, unfollowUser } from '../services/api';
import { User } from '../types/requests';
import { useNavigation } from '@react-navigation/native';

interface FollowUsersProps {
  user: User;
  users: User[];
  queryKey: string[];
}

const FollowUsers: React.FC<FollowUsersProps> = ({ user, users, queryKey }) => {
  const queryClient = useQueryClient();
  const navigation = useNavigation();


  const followMutation = useMutation({
    mutationFn: ({ follower_id, leader_id }: { follower_id: string; leader_id: string }) =>
      followUser(follower_id, leader_id),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey});
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: ({ follower_id, leader_id }: { follower_id: string; leader_id: string }) =>
      unfollowUser(follower_id, leader_id),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey});
    },
  });

  const handleFollowToggle = (item: User) => {
    if (item.leader) {
      unfollowMutation.mutate({ follower_id: user.id, leader_id: item.id });
    } else {
      followMutation.mutate({ follower_id: user.id, leader_id: item.id });
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.contentContainer}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('OtherUserGoals', { userId: item.id, enableEdits: false })}>
            <Text>{item.username}</Text>
            </TouchableOpacity>
            <Button
              title={item.leader ? 'Unfollow' : 'Follow'}
              onPress={() => handleFollowToggle(item)}
            />
          </View>
        )}
      />
    </View>
  );
};

export default FollowUsers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  contentContainer: {
    paddingBottom: 150
  },
});