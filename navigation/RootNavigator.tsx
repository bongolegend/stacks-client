// RootNavigator.tsx
import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/Login';
import InApp from '../screens/InApp';
import CreateGoal from '../screens/CreateGoal';
import CreateMilestone from '../screens/CreateMilestone';
import CommentsScreen from '../screens/CommentsScreen';
import FollowersScreen from '../screens/FollowersScreen';
import { RootStackParamList } from './types';
import LeadersScreen from '../screens/LeadersScreen';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import Profile from '../screens/Profile';

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
      <Stack.Screen name="CreateMilestone" component={CreateMilestone} options={{ headerShown: false }} />
      <Stack.Screen name="CommentsScreen" component={CommentsScreen} options={() => ({
        headerTitle: 'Comments',
        headerTitleAlign: 'center',
      })} />
      <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
      <Stack.Screen name="Followers" component={FollowersScreen} options={() => ({
        headerTitle: 'Followers',
        headerTitleAlign: 'center',
      })} />
      <Stack.Screen name="Leaders" component={LeadersScreen} options={() => ({
        headerTitle: 'Following',
        headerTitleAlign: 'center',
      })} />
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