// App.tsx
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RootNavigator from './RootNavigator';
import AppProviders from './AppProviders';
import useInitialization from './useInitialization';

const queryClient = new QueryClient();

const App: React.FC = () => {
  const { isReady, initialState } = useInitialization();

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AppProviders initialState={initialState}>
        <RootNavigator />
      </AppProviders>
    </QueryClientProvider>
  );
};

export default App;
