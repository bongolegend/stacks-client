// useInitialization.ts
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PERSISTENCE_KEY = 'NAVIGATION_STATE';

const useInitialization = () => {
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

    restoreState();
  }, []);

  const onStateChange = async (state) => {
    try {
      await AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error(e);
    }
  };

  return { isReady, initialState, onStateChange };
};

export default useInitialization;
