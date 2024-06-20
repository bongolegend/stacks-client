// RootNavigator.tsx
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/Login';
import InApp from '../screens/InApp';
import CreateGoal from '../screens/CreateGoal';
import CreateMilestone from '../screens/CreateMilestone';
import CommentsScreen from '../screens/CommentsScreen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC<{ initialState?: any, onStateChange?: (state: any) => void }> = ({ initialState, onStateChange }) => (
  <NavigationContainer
    initialState={initialState}
    onStateChange={onStateChange}
    documentTitle={{formatter: () => "getstacks.io"}}
  >
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="InApp" component={InApp} />
      <Stack.Screen name="CreateGoal" component={CreateGoal} />
      <Stack.Screen name="CreateMilestone" component={CreateMilestone} />
      <Stack.Screen
          name="CommentsScreen"
          component={CommentsScreen}
          options={() => ({
            headerShown: true,
            headerTitle: 'Post',
          })}
        />


    </Stack.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  backButton: {
    marginLeft: 10,
  },
  backButtonText: {
    fontSize: 18,
    color: '#000',
  },
});

export default RootNavigator;
