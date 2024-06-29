// InApp.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Announcements from './Announcements';
import Search from './Search';
import { useNavigation } from '@react-navigation/native';
import HeaderBar from '../components/HeaderBar';
import { useUser } from '../contexts/UserContext';
import Goals from './Goals';
import Notifications from './Notifications';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons
import { useQuery } from '@tanstack/react-query'; // Import useQuery from React Query
import { fetchUnreadCommentCount } from '../services/api';

const Tab = createBottomTabNavigator();

const InApp: React.FC = () => {
  const navigation = useNavigation();
  const { user, isLoading } = useUser();

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['unreadCommentCount'],
    queryFn: () => fetchUnreadCommentCount(user!.id),
    enabled: !!user,
    // refetchOnWindowFocus: true,
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderBar />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Timeline') {
              iconName = 'home-outline';
            } else if (route.name === 'Goals') {
              iconName = 'trophy-outline';
            } else if (route.name === 'Notifications') {
              iconName = 'notifications-outline';
            } else if (route.name === 'Search') {
              iconName = 'search-outline';
            }

            return (
              <View>
                <Ionicons name={iconName} size={size} color={color} />
                {route.name === 'Notifications' && unreadCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </Text>
                  </View>
                )}
              </View>
            );
          },
        })}
      >
        <Tab.Screen name="Timeline" component={Announcements} />
        <Tab.Screen name="Goals" component={Goals} initialParams={{ userId: user?.id, enableEdits: true }} />
        <Tab.Screen name="Notifications" component={Notifications} />
        <Tab.Screen name="Search" component={Search} />
      </Tab.Navigator>
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('CreateGoal')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    bottom: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    backgroundColor: '#03A9F4',
    borderRadius: 30,
    elevation: 8,
    zIndex: 10,
  },
  fabText: {
    fontSize: 24,
    color: 'white',
  },
  badge: {
    position: 'absolute',
    right: -10,
    top: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '900',
  },
});

export default InApp;