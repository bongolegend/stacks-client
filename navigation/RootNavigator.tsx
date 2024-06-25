// RootNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/Login';
import InApp from '../screens/InApp';
import CreateGoal from '../screens/CreateGoal';
import CreateSubgoal from '../screens/CreateMilestone';
import Comments from '../screens/Comments';
import { RootStackParamList } from './types';
import Profile from '../screens/Profile';
import Followers from '../screens/Followers';
import Leaders from '../screens/Leaders';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC<{ initialState?: any, onStateChange?: (state: any) => void }> = ({ initialState, onStateChange }) => (
  <NavigationContainer
    initialState={initialState}
    onStateChange={onStateChange}
    documentTitle={{formatter: () => "getstacks.io"}}
  >
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="InApp" component={InApp} options={{ headerShown: false }} />
      <Stack.Screen name="CreateGoal" component={CreateGoal} options={{ headerShown: false }} />
      <Stack.Screen name="CreateMilestone" component={CreateSubgoal} options={{ headerShown: false }} />
      <Stack.Screen name="Comments" component={Comments} options={() => ({
        headerTitle: 'Comments',
        headerTitleAlign: 'center',
      })} />
      <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
      <Stack.Screen name="Followers" component={Followers} options={() => ({
        headerTitle: 'Followers',
        headerTitleAlign: 'center',
      })} />
      <Stack.Screen name="Leaders" component={Leaders} options={() => ({
        headerTitle: 'Following',
        headerTitleAlign: 'center',
      })} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default RootNavigator;