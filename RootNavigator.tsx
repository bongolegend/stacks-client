// RootNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './Login';
import InApp from './InApp';
import CreateGoal from './CreateGoal';
import CreateTask from './CreateTask';
import { RootStackParamList } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC<{ initialState?: any }> = ({ initialState }) => (
  <NavigationContainer
    initialState={initialState}
    onStateChange={(state) =>
      AsyncStorage.setItem('NAVIGATION_STATE', JSON.stringify(state))
    }
  >
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="InApp" component={InApp} />
      <Stack.Screen name="CreateGoal" component={CreateGoal} />
      <Stack.Screen name="CreateTask" component={CreateTask} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default RootNavigator;
