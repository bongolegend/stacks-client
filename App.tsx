// App.tsx
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProvider } from './UserContext';
import Login from './Login';
import InApp from './InApp';
import CreateGoal from './CreateGoal';
import CreateTask from './CreateTask';
import { RootStackParamList } from './types';
import { NotificationProvider } from './NotificationContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

const PERSISTENCE_KEY = 'NAVIGATION_STATE';
const queryClient = new QueryClient();

const App: React.FC = () => {
  const [isReady, setIsReady] = useState(false);
  const [initialState, setInitialState] = useState();

  useEffect(() => {
    const restoreState = async () => {
      try {
        const savedState = await AsyncStorage.getItem(PERSISTENCE_KEY);
        if (savedState) {
          setInitialState(JSON.parse(savedState));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsReady(true);
      }
    };

    if (!isReady) {
      restoreState();
    }
  }, [isReady]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <UserProvider>
          <NavigationContainer
            initialState={initialState}
            onStateChange={(state) => AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))}
          >
            <Stack.Navigator screenOptions={{ headerShown: false }} >
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
