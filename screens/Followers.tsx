import React from 'react';
import { View, Text } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { fetchFollowers } from '../services/api';
import { useUser } from '../contexts/UserContext';
import FollowUsers from '../components/FollowUsers';

const Followers: React.FC = () => {
  const { user } = useUser();
  const queryKey = ['followers', user?.id];
  const { data: followers, isLoading } = useQuery({
    queryKey: queryKey,
    queryFn: () => fetchFollowers(user!.id),
  });

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return <FollowUsers user={user} users={followers} queryKey={queryKey} />;
};

export default Followers;