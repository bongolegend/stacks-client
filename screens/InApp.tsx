// InApp.tsx
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Timeline from '../Timeline';
import Goals from './Goals';
import Search from './Search';
import ContentCreationButtonsModal from '../components/ContentCreationButtonsModal';

const Tab = createBottomTabNavigator();

const InApp: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Timeline" component={Timeline} />
        <Tab.Screen name="Goals" component={Goals} />
        <Tab.Screen name="Search" component={Search} />
      </Tab.Navigator>
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
      <ContentCreationButtonsModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
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
