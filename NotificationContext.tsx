import React, { createContext, useState, useContext, ReactNode } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

type NotificationContextType = {
  showNotification: (message: string) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notification, setNotification] = useState<string | null>(null);
  const fadeAnim = useState(new Animated.Value(0))[0]; // Initial opacity value of 0

  const showNotification = (message: string) => {
    setNotification(message);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500, // Fade in duration
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500, // Fade out duration
          useNativeDriver: true,
        }).start(() => setNotification(null));
      }, 2000); // Display notification for 2 seconds
    });
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification && (
        <Animated.View style={[styles.notification, { opacity: fadeAnim }]}>
          <Text style={styles.notificationText}>{notification}</Text>
        </Animated.View>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

const styles = StyleSheet.create({
  notification: {
    position: 'absolute',
    bottom: 30,
    left: '50%',
    transform: [{ translateX: -50 }],
    backgroundColor: 'rgba(211, 211, 211, 0.9)', // Light grey background
    padding: 10,
    borderRadius: 5,
  },
  notificationText: {
    color: '#000',
    fontSize: 16,
  },
});