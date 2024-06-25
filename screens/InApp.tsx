// InApp.tsx
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Announcements from './Announcements';
import Goals from './Goals';
import Search from './Search';
import { useNavigation } from '@react-navigation/native';
import HeaderBar from '../components/HeaderBar';

const Tab = createBottomTabNavigator();

const InApp: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <HeaderBar />
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Announcements" component={Announcements} />
        <Tab.Screen name="Goals" component={Goals} />
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
