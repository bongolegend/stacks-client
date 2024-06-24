import React from 'react';
import { View, Text } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { fetchLeaders } from '../services/api';
import { useUser } from '../contexts/UserContext';
import FollowUsers from '../components/FollowUsers';

const Leaders: React.FC = () => {
  const { user } = useUser();
  const queryKey = ['leaders', user?.id];
  const { data: leaders, isLoading } = useQuery({
    queryKey: queryKey,
    queryFn: () => fetchLeaders(user!.id),
  });

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return <FollowUsers user={user} users={leaders} queryKey={queryKey} />;
};

export default Leaders;