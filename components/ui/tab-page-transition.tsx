import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, { Easing, FadeIn } from 'react-native-reanimated';

interface TabPageTransitionProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function TabPageTransition({ children, style }: TabPageTransitionProps) {
  const [focusKey, setFocusKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setFocusKey((prev) => prev + 1);
    }, [])
  );

  return (
    <Animated.View
      key={focusKey}
      entering={FadeIn.duration(220).easing(Easing.out(Easing.cubic))}
      style={[{ flex: 1 }, style]}
    >
      {children}
    </Animated.View>
  );
}
