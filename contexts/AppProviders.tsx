// AppProviders.tsx
import React, { ReactNode } from 'react';
import { UserProvider } from './UserContext';
import { NotificationProvider } from './NotificationContext';

const AppProviders: React.FC<{ children: ReactNode }> = ({ children }) => (
  <NotificationProvider>
    <UserProvider>
      {children}
    </UserProvider>
  </NotificationProvider>
);

export default AppProviders;
