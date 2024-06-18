// SharedForm.tsx
import React, { useRef, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

const SharedForm: React.FC<{ 
  title: string, 
  placeholder: string, 
  value: string, 
  setValue: (text: string) => void, 
  onPost: () => void, 
  navigation: any 
}> = ({ title, placeholder, value, setValue, onPost, navigation }) => {
  const textInputRef = useRef<TextInput>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (textInputRef.current) {
        textInputRef.current.focus();
      }
    }, 300); 
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>X</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.postButton} onPress={onPost}>
          <Text style={styles.postButtonText}>{title}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          ref={textInputRef}
          style={styles.textInput}
          placeholder={placeholder}
          multiline
          value={value}
          onChangeText={setValue}
        />
      </View>
    </View>
  );
};

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
    padding: 16,
  },
  textInput: {
    fontSize: 18,
    textAlignVertical: 'top',
    minHeight: 100,
  },
});

export default SharedForm;
