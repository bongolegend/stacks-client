import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './Login';
import InApp from './InApp';
import CreateGoal from './CreateGoal';
import CreateTask from './CreateTask';
import { RootStackParamList } from './types';
import { NotificationProvider } from './NotificationContext';

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <NotificationProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="InApp" component={InApp} options={{ headerShown: false }} />
          <Stack.Screen name="CreateGoal" component={CreateGoal} />
          <Stack.Screen name="CreateTask" component={CreateTask} />
        </Stack.Navigator>
      </NavigationContainer>
    </NotificationProvider>
  );
};

export default App;