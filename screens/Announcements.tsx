import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { fetchAnnouncements, fetchGoals } from '../services/api';
import { useUser } from '../contexts/UserContext';
import Announcement from '../components/Announcement';


const Announcements: React.FC = () => {
  const { user } = useUser();

  const { data: announcements, isLoading } = useQuery({
    queryKey: ['announcements', user?.id],
    queryFn: () => fetchGoals(user!.id),
    // queryFn: () => fetchAnnouncements(user!.id),
    enabled: !!user,
  });

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={announcements}
          renderItem={({ item }) => (
            <Announcement item={item} />
          )}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

export default Announcements;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
