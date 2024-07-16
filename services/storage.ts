import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FIREBASE_AUTH } from '../utils/firebase-auth';


const USER_KEY = 'currentUser';
export const ACCESS_TOKEN = 'jwtAccessToken'
const REFRESH_TOKEN = 'refreshToken'

export const saveUser = async (user: any) => {
  const userString = JSON.stringify(user);
  if (Platform.OS === 'web') {
    console.log("saving user info in localStorage", userString)
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


export const saveAccessToken = async (accessToken: string) => {
  if (Platform.OS === 'web') {
    console.log(`Storing access token to localStorage: ${accessToken}`)
    localStorage.setItem(ACCESS_TOKEN, accessToken);
  } else {
    await AsyncStorage.setItem(ACCESS_TOKEN, accessToken);
  }
};


export const getAccessToken = async () => {
  if (Platform.OS === 'web') {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    return accessToken ? accessToken : null;
  } else {
    const accessToken = await AsyncStorage.getItem(ACCESS_TOKEN);
    return accessToken
  }
};

export const removeAccessToken = async () => {
  if (Platform.OS === 'web') {
    localStorage.removeItem(ACCESS_TOKEN);
  } else {
    await AsyncStorage.removeItem(ACCESS_TOKEN);
  }
};


export const refreshToken = async () => {
  const user = FIREBASE_AUTH.currentUser;
  if (user) {
    // This will automatically refresh the token and update the user's ID token.
    await user.getIdToken(true); 
    const newIdToken = await user.getIdToken();
    if (Platform.OS === 'web') {
      localStorage.setItem(ACCESS_TOKEN, newIdToken);
    } else {
      await AsyncStorage.setItem(ACCESS_TOKEN, newIdToken);
    }
    return newIdToken;
  }
  throw new Error('No current user');
};


