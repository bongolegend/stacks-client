// Search.tsx
import React from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchUsers, followUser, unfollowUser } from './api';
import { useUser } from './UserContext';

interface UserEnriched {
  email: string;
  username: string;
  id: string;
  created_at: string;
  updated_at: string;
  leader: boolean;
}

const Search: React.FC = () => {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['users', user?.id],
    queryFn: () => fetchUsers(user!.id),
    enabled: !!user,
  });

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

  const handleFollowToggle = (item: UserEnriched) => {
    if (item.leader) {
      unfollowMutation.mutate({ follower_id: user!.id, leader_id: item.id });
    } else {
      followMutation.mutate({ follower_id: user!.id, leader_id: item.id });
    }
  };

  const renderUserItem = ({ item }: { item: UserEnriched }) => (
    <View style={styles.userItem}>
      <View>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.email}>{item.email}</Text>
      </View>
      <Button
        title={item.leader ? 'Unfollow' : 'Follow'}
        onPress={() => handleFollowToggle(item)}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {usersLoading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={users}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  username: {
    fontWeight: 'bold',
  },
  email: {
    color: 'gray',
  },
});
