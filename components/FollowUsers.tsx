import React from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { followUser, unfollowUser } from '../services/api';
import { User, Follow } from '../types/requests';

interface FollowUsersProps {
  user: User;
  users: User[];
  queryKey: string[];
}

const FollowUsers: React.FC<FollowUsersProps> = ({ user, users, queryKey }) => {
  const queryClient = useQueryClient();


  const followMutation = useMutation({
    mutationFn: ({ follower_id, leader_id }: { follower_id: string; leader_id: string }) =>
      followUser(follower_id, leader_id),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: ({ follower_id, leader_id }: { follower_id: string; leader_id: string }) =>
      unfollowUser(follower_id, leader_id),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
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
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text>{item.username}</Text>
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
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});