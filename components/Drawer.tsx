// Drawer.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { useUser } from '../contexts/UserContext';
import { useNavigation } from '@react-navigation/native';
import { fetchFollowCounts } from '../services/api';

const Drawer: React.FC<{ closeDrawer: () => void }> = ({ closeDrawer }) => {
  const { user } = useUser();
  const navigation = useNavigation();
  const [followCounts, setFollowCounts] = useState<{ followers: number; leaders: number }>({ followers: 0, leaders: 0 });

  useEffect(() => {
    const getFollowCounts = async () => {
      if (user) {
        const counts = await fetchFollowCounts(user.id);
        setFollowCounts(counts);
      }
    };
    getFollowCounts();
  }, [user]);

  return (
    <View style={styles.drawerContainer}>
      <View style={styles.avatarPlaceholder}></View>
      <Text style={styles.username}>{user?.username}</Text>
      <Text style={styles.email}>{user?.email}</Text>
      <View style={styles.buttonsContainer}>
        <Button
          title={`${followCounts.followers} Followers`}
          onPress={() => {
            closeDrawer();
            navigation.navigate('Followers');
          }}
        />
        <Button
          title={`${followCounts.leaders} Following`}
          onPress={() => {
            closeDrawer();
            navigation.navigate('Leaders');
          }}
        />
      </View>
      <TouchableOpacity style={styles.closeButton} onPress={closeDrawer}>
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Drawer;

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'gray',
    alignSelf: 'center',
    marginBottom: 16,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  closeButton: {
    marginTop: 'auto',
    padding: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#000',
  },
});