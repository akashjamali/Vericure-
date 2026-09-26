import React, { createContext, useContext } from 'react';
import { useSharedValue, SharedValue } from 'react-native-reanimated';

interface ScrollContextType {
  headerTranslateY: SharedValue<number>;
  tabBarTranslateY: SharedValue<number>;
}

const ScrollContext = createContext<ScrollContextType | null>(null);

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const headerTranslateY = useSharedValue(0);
  const tabBarTranslateY = useSharedValue(0);

  return (
    <ScrollContext.Provider value={{ headerTranslateY, tabBarTranslateY }}>
      {children}
    </ScrollContext.Provider>
  );
}

export function useScrollContext() {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error('useScrollContext must be used within a ScrollProvider');
  }
  return context;
}
