// RootNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './Login';
import InApp from '../screens/InApp';
import CreateGoal from './CreateGoal';
import CreateMilestone from './CreateMilestone';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC<{ initialState?: any, onStateChange?: (state: any) => void }> = ({ initialState, onStateChange }) => (
  <NavigationContainer
    initialState={initialState}
    onStateChange={onStateChange}
  >
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="InApp" component={InApp} />
      <Stack.Screen name="CreateGoal" component={CreateGoal} />
      <Stack.Screen name="CreateMilestone" component={CreateMilestone} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default RootNavigator;
