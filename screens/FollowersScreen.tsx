// FollowersScreen.tsx
import React from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchFollowers, followUser, unfollowUser } from '../services/api';
import { useUser } from '../contexts/UserContext';

const FollowersScreen: React.FC = () => {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const { data: followers, isLoading } = useQuery({
    queryKey: ['followers', user?.id], 
    queryFn: () => fetchFollowers(user!.id)});

  const followMutation = useMutation({
    mutationFn: ({ follower_id, leader_id }: { follower_id: string; leader_id: string }) =>
      followUser(follower_id, leader_id),
    onSuccess: () => {
      queryClient.invalidateQueries(['users', user?.id]);
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: ({ follower_id, leader_id }: { follower_id: string; leader_id: string }) =>
      unfollowUser(follower_id, leader_id),
    onSuccess: () => {
      queryClient.invalidateQueries(['users', user?.id]);
    },
  });

  const handleFollowToggle = (followerId: string, isFollowing: boolean) => {
    if (isFollowing) {
      unfollowMutation.mutate({ follower_id: user!.id, leader_id: followerId });
    } else {
      followMutation.mutate({ follower_id: user!.id, leader_id: followerId });
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={followers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text>{item.username}</Text>
              <Button
                title={item.leader ? 'Unfollow' : 'Follow'}
                onPress={() => handleFollowToggle(item.id, item.leader)}
              />
            </View>
          )}
        />
      )}
    </View>
  );
};

export default FollowersScreen;

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