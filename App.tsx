// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from './Login';
import InApp from './InApp';
import CreateGoal from './CreateGoal';
import CreateTask from './CreateTask';
import { RootStackParamList } from './types';
import { NotificationProvider } from './NotificationContext';
import { UserProvider } from './UserContext';

const Stack = createStackNavigator<RootStackParamList>();
const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <UserProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }} >
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="InApp" component={InApp} />
              <Stack.Screen name="CreateGoal" component={CreateGoal} />
              <Stack.Screen name="CreateTask" component={CreateTask} />
            </Stack.Navigator>
          </NavigationContainer>
        </UserProvider>
      </NotificationProvider>
    </QueryClientProvider>
  );
};

export default App;
