import React, { createContext, useContext, useEffect, useState } from 'react';
import { saveUser, getUser, removeUser } from './storage';

interface User {
  email: string;
  username: string;
  id: string;
  created_at: string;
  updated_at: string;
  leader: boolean;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await getUser();
      if (storedUser) {
        setUserState(storedUser);
      }
    };

    loadUser();
  }, []);

  const setUser = (user: User | null) => {
    setUserState(user);
    if (user) {
      saveUser(user);
    } else {
      removeUser();
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
