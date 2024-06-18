// AppProviders.tsx
import React from 'react';
import { UserProvider } from './UserContext';
import { NotificationProvider } from './NotificationContext';

const AppProviders: React.FC<{ initialState?: any }> = ({ children, initialState }) => (
  <NotificationProvider>
    <UserProvider>
      {children}
    </UserProvider>
  </NotificationProvider>
);

export default AppProviders;
