import React from 'react';
import { View, Text } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '../services/api';
import { useUser } from '../contexts/UserContext';
import FollowUsers from '../components/FollowUsers';

const Search: React.FC = () => {
  const { user } = useUser();
  const queryKey = ['users', user?.id];
  const { data: users, isLoading } = useQuery({
    queryKey: queryKey,
    queryFn: () => fetchUsers(user!.id),
  });

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return <FollowUsers user={user} users={users} queryKey={queryKey} />;
};

export default Search;

