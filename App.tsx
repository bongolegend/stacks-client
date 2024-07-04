// App.tsx
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, ActivityIndicator } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RootNavigator from './navigation/RootNavigator';
import AppProviders from './contexts/AppProviders';
import useInitialization from './utils/useInitialization';

const queryClient = new QueryClient();

const App: React.FC = () => {
  const { isReady, initialState, onStateChange } = useInitialization();

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <AppProviders>
          <RootNavigator initialState={initialState} onStateChange={onStateChange} />
        </AppProviders>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
};

export default App;