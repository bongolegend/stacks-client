// InApp.tsx
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Announcements from './Announcements';
import Search from './Search';
import { useNavigation } from '@react-navigation/native';
import HeaderBar from '../components/HeaderBar';
import { useUser } from '../contexts/UserContext';
import Goals from './Goals';

const Tab = createBottomTabNavigator();

const InApp: React.FC = () => {
  const navigation = useNavigation();
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  console.log("InApp.txt > user", user)

  return (
    <View style={styles.container}>
      <HeaderBar />
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Timeline" component={Announcements} />
        <Tab.Screen name="Goals" component={Goals} initialParams={{ userId: user?.id, enableEdits: true}} />
        <Tab.Screen name="Search" component={Search} />
      </Tab.Navigator>
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('CreateGoal')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default InApp;

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
});