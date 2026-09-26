import '../index.css';
import { useColorScheme } from '@/hooks/useColorScheme';
import { InventoryProvider } from '@/providers/inventory-context';
import { ScrollProvider } from '@/providers/scroll-context';
import { ThemeProvider } from '@/providers/theme-provider';
import { Colors } from '@/theme/colors';
import * as NavigationBar from 'expo-navigation-bar';
import { Stack } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { setBackgroundColorAsync } from 'expo-system-ui';
import React, { useEffect } from 'react';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

SplashScreen.setOptions({
  duration: 200,
  fade: true,
});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider storage={SecureStore}>
        <InventoryProvider>
          <ScrollProvider>
            <RootNavigator />
          </ScrollProvider>
        </InventoryProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

function RootNavigator() {
  useEffect(() => {
    if (Platform.OS === 'android') {
      try {
        NavigationBar.setStyle('dark');
      } catch {}
    }
  }, []);

  useEffect(() => {
    try {
      setBackgroundColorAsync(Colors.light.background);
    } catch {}
  }, []);

  const cardColor = Colors.light.card;

  return (
    <>
      <StatusBar style="dark" animated />

      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          animationDuration: 260,
          contentStyle: { backgroundColor: '#fcfcfc' },
        }}
      >
        <Stack.Screen name='index' options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name='(auth)' options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        <Stack.Screen
          name='security-privacy'
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name='help-support'
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name='saved-reports'
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name='medical-conditions'
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />

        <Stack.Screen
          name='sheet'
          options={{
            headerShown: false,
            sheetGrabberVisible: true,
            sheetAllowedDetents: [0.4, 0.7, 1],
            contentStyle: {
              backgroundColor: cardColor,
            },
            headerTransparent: Platform.OS === 'ios',
            headerLargeTitle: false,
            title: '',
            presentation: 'modal',
            sheetInitialDetentIndex: 0,
            headerStyle: {
              backgroundColor: cardColor,
            },
          }}
        />
        <Stack.Screen name='+not-found' />
      </Stack>
    </>
  );
}
