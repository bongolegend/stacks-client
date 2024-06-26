import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = 'currentUser';

export const saveUser = async (user: any) => {
  const userString = JSON.stringify(user);
  if (Platform.OS === 'web') {
    localStorage.setItem(USER_KEY, userString);
  } else {
    await AsyncStorage.setItem(USER_KEY, userString);
  }
};

export const getUser = async () => {
  if (Platform.OS === 'web') {
    const userString = localStorage.getItem(USER_KEY);
    return userString ? JSON.parse(userString) : null;
  } else {
    const userString = await AsyncStorage.getItem(USER_KEY);
    return userString ? JSON.parse(userString) : null;
  }
};

export const removeUser = async () => {
  if (Platform.OS === 'web') {
    localStorage.removeItem(USER_KEY);
  } else {
    await AsyncStorage.removeItem(USER_KEY);
  }
};
