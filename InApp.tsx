import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Modal } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import Timeline from './Timeline';
import Goals from './Goals';

type InAppScreenRouteProp = RouteProp<RootStackParamList, 'InApp'>;
type InAppScreenNavigationProp = StackNavigationProp<RootStackParamList, 'InApp'>;

type Props = {
  route: InAppScreenRouteProp;
  navigation: InAppScreenNavigationProp;
};

const Tab = createBottomTabNavigator();

const InApp: React.FC<Props> = ({ route, navigation }) => {
  const { userId } = route.params;
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
      <Tab.Navigator>
        <Tab.Screen name="Timeline" component={Timeline} />
        <Tab.Screen name="Goals" component={Goals} />
      </Tab.Navigator>
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalButton} onPress={handleCreateGoal}>
              <Text style={styles.modalButtonText}>Create Goal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={handleCreateTask}>
              <Text style={styles.modalButtonText}>Create Task</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
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
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButton: {
    padding: 10,
    backgroundColor: '#03A9F4',
    borderRadius: 5,
    marginVertical: 5,
  },
  modalButtonText: {
    fontSize: 18,
    color: '#fff',
  },
});