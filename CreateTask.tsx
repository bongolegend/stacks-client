import React, { useRef, useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import { useNotification } from './NotificationContext';

type CreateTaskScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CreateTask'>;

const CreateTask: React.FC = () => {
    const navigation = useNavigation<CreateTaskScreenNavigationProp>();
    const { showNotification } = useNotification();
    const textInputRef = useRef<TextInput>(null);
    const [selectedValue, setSelectedValue] = useState<string>('option1');

    useEffect(() => {
    const timer = setTimeout(() => {
        if (textInputRef.current) {
        textInputRef.current.focus();
        }
    }, 300); // Delay to ensure screen transition is complete
    return () => clearTimeout(timer);
    }, []);

    const handlePost = () => {
    console.log("Task posted");
    showNotification("Task Posted");
    navigation.goBack();
    };

    return (
    <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
        <View style={styles.header}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>X</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.postButton} onPress={handlePost}>
            <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
        <Picker
            selectedValue={selectedValue}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedValue(itemValue)}
        >
            <Picker.Item label="Option 1" value="option1" />
            <Picker.Item label="Option 2" value="option2" />
        </Picker>
        <TextInput
            ref={textInputRef}
            style={styles.textInput}
            placeholder="Enter your task..."
            multiline
        />
        </View>
    </KeyboardAvoidingView>
    );
};

export default CreateTask;

const styles = StyleSheet.create({
    container: {
    flex: 1,
    },
    header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f0f0',
    },
    button: {
    padding: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
    },
    buttonText: {
    fontSize: 18,
    color: '#000',
    },
    postButton: {
    padding: 10,
    backgroundColor: '#03A9F4',
    borderRadius: 5,
    },
    postButtonText: {
    fontSize: 18,
    color: '#fff',
    },
    inputContainer: {
    flex: 1,
    padding: 16,
    },
    picker: {
    height: 50,
    width: '100%',
    marginBottom: 16,
    },
    textInput: {
    flex: 1,
    fontSize: 18,
    textAlignVertical: 'top', // For Android to align text at the top
    },
});