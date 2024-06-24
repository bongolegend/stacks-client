// Profile.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, Alert } from 'react-native';
import { useUser } from '../contexts/UserContext';
import { useNavigation } from '@react-navigation/native';
import { fetchFollowCounts } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import SignOutModal from '../components/SignOutModal';

const Profile: React.FC<{ closeDrawer: () => void }> = ({ closeDrawer }) => {
  const { user, setUser } = useUser();
  const navigation = useNavigation();
  const [followCounts, setFollowCounts] = useState<{ followers: number; leaders: number }>({ followers: 0, leaders: 0 });
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const getFollowCounts = async () => {
      if (user) {
        const counts = await fetchFollowCounts(user.id);
        setFollowCounts(counts);
      }
    };
    getFollowCounts();
  }, [user]);

  const handleSignOut = async () => {
    await AsyncStorage.clear();
    setUser(null);
    navigation.navigate('Login');
  };

  return (
    <View style={styles.drawerContainer}>
      <TouchableOpacity style={styles.closeIcon} onPress={() => navigation.goBack()}>
        <Ionicons name="close" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.avatarPlaceholder}></View>
      <Text style={styles.username}>{user?.username}</Text>
      <Text style={styles.email}>{user?.email}</Text>
      <View style={styles.buttonsContainer}>
        <View style={styles.button}>
          <Button
            title={`${followCounts.followers} Followers`}
            onPress={() => {
              navigation.navigate('Followers');
            }}
          />
        </View>
        <View style={styles.button}>
          <Button
            title={`${followCounts.leaders} Following`}
            onPress={() => {
              closeDrawer();
              navigation.navigate('Leaders');
            }}
          />
        </View>
        <View style={styles.button}>
          <Button
            title="Sign Out"
            onPress={() => setModalVisible(true)}
            color="red"
          />
        </View>
      </View>
      <SignOutModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleSignOut}
      />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  closeIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
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
    flexDirection: 'column',
    marginBottom: 16,
  },
  button: {
    marginBottom: 10,  // Add space between buttons
  },
});