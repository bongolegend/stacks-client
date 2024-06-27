import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { fetchAnnouncements } from '../services/api';
import { useUser } from '../contexts/UserContext';
import Announcement from '../components/Announcement';
import { GoalEnriched } from '../types/requests';


const Announcements: React.FC = () => {
  const { user } = useUser();

  const { data: announcements, isLoading } = useQuery({
    queryKey: ['announcements', user?.id],
    queryFn: () => fetchAnnouncements(user!.id),
    enabled: !!user,
  });

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={announcements?.sort((a: GoalEnriched, b: GoalEnriched) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())}
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
    backgroundColor: 'white',
  },
});
