// InApp.tsx
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Modal, TouchableWithoutFeedback } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import Timeline from './Timeline';
import Goals from './Goals';
import Search from './Search';

type InAppScreenRouteProp = RouteProp<RootStackParamList, 'InApp'>;
type InAppScreenNavigationProp = StackNavigationProp<RootStackParamList, 'InApp'>;

type Props = {
  route: InAppScreenRouteProp;
  navigation: InAppScreenNavigationProp;
};

const Tab = createBottomTabNavigator();

const InApp: React.FC<Props> = ({ route, navigation }) => {
  // const { userId } = route.params;
  const [modalVisible, setModalVisible] = useState(false);

  const handleCreateGoal = () => {
    setModalVisible(false);
    navigation.navigate('CreateGoal');
  };

  const handleCreateTask = () => {
    setModalVisible(false);
    navigation.navigate('CreateTask');
  };

  return (
    <View style={styles.container}>
      <Tab.Navigator screenOptions={{ headerShown: false }} >
        <Tab.Screen name="Timeline" component={Timeline} />
        <Tab.Screen name="Goals" component={Goals} />
        <Tab.Screen name="Search" component={Search} />
      </Tab.Navigator>
      <TouchableOpacity style={[styles.fab]} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.buttonContainer}>
                <Text style={styles.buttonCaption}>Milestone</Text>
                <TouchableOpacity style={[styles.modalButton, styles.taskButton]} onPress={handleCreateTask}>
                  <Text style={[styles.modalButtonText, styles.taskButtonText]}>+</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.buttonContainer}>
                <Text style={styles.buttonCaption}>Goal</Text>
                <TouchableOpacity style={styles.modalButton} onPress={handleCreateGoal}>
                  <Text style={styles.modalButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
    zIndex: 10, // Ensure the FAB is above other components
  },
  fabText: {
    fontSize: 24,
    color: 'white',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Light opaque background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    position: 'absolute',
    bottom: 50, // Align modal content with the FAB
    right: 30,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonCaption: {
    marginRight: 10,
    fontSize: 18,
  },
  modalButton: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#03A9F4',
    borderRadius: 30,
    elevation: 8, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  modalButtonText: {
    fontSize: 24,
    color: 'white',
  },
  taskButton: {
    backgroundColor: 'white',
    borderColor: '#03A9F4',
    borderWidth: 2,
  },
  taskButtonText: {
    color: '#03A9F4',
  },
});