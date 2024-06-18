import React from 'react';
import { View, Text, Modal, TouchableOpacity, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ContentCreationButtonsModal: React.FC<{ modalVisible: boolean, setModalVisible: (visible: boolean) => void }> = ({ modalVisible, setModalVisible }) => {
  const navigation = useNavigation();

  const handleCreateGoal = () => {
    setModalVisible(false);
    navigation.navigate('CreateGoal');
  };

  const handleCreateMilestone = () => {
    setModalVisible(false);
    navigation.navigate('CreateMilestone');
  };

  return (
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
              <TouchableOpacity style={[styles.modalButton, styles.taskButton]} onPress={handleCreateMilestone}>
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
  );
};

export default ContentCreationButtonsModal;

const styles = StyleSheet.create({
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
    alignItems: 'flex-end', // Align items to the right
  },
  buttonContainer: {
    flexDirection: 'row', // Place text and button in a row
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
