import { Stack } from 'expo-router';
import React from 'react';

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 260,
        contentStyle: { backgroundColor: '#fcfcfc' },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="scan-result" options={{ headerShown: false }} />
      <Stack.Screen name="medicine-cabinet" options={{ headerShown: false }} />
      <Stack.Screen name="recent-scans" options={{ headerShown: false }} />
    </Stack>
  );
}

