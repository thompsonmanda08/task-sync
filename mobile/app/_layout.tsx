import '../global.css';

import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ThemeProvider, useTheme } from '@/components/providers/theme-provider';
import ToastContainer from '@/components/ui/toast-container';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import SplashScreenView from '@/components/SplashScreen';
import { InitializeUserSession, useAuthStore } from '@/store/authStore';
import React from 'react';

const queryClient = new QueryClient();

// Ensure splash screen stays visible while fonts load
SplashScreen.preventAutoHideAsync();

function RootLayout() {
  useFrameworkReady();

  const [isSplashAnimationComplete, setIsSplashAnimationComplete] =
    useState(false);

  useFrameworkReady();
  const {isAuthenticated} = useAuthStore()

  const [fontsLoaded, error] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-Bold': Inter_700Bold,
    BadScript: require('../assets/fonts/BadScript-Regular.ttf'),
  });

  useEffect(() => {
    InitializeUserSession();
  }, []);

  useEffect(() => {
    // Only hide splash screen when both fonts are loaded AND splash animation is complete
    if ((fontsLoaded || error) && isSplashAnimationComplete) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error, isSplashAnimationComplete]);

  // Show splash screen until both fonts are loaded AND splash animation is complete
  if (!fontsLoaded && !error && !isSplashAnimationComplete) {
    return (
      <SplashScreenView
        onAnimationComplete={() => setIsSplashAnimationComplete(true)}
      />
    );
  }

  // If fonts are loaded but splash animation isn't complete, still show splash
  if (!isSplashAnimationComplete) {
    return (
      <SplashScreenView
        onAnimationComplete={() => setIsSplashAnimationComplete(true)}
      />
    );
  }

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView className="flex-1">
          {/* <StatusBar style="dark"  /> */}
          <Stack screenOptions={{ headerShown: false }}>
            {/* Auth Routes */}
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />

            {/* Authenticated Routes */}
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="lists/[id]" options={{ headerShown: false }} />
            <Stack.Screen
              name="lists/create"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="groups/[id]" options={{ headerShown: false }} />
            <Stack.Screen
              name="groups/create"
              options={{ headerShown: false }}
            />

            {/* Not Found Route (always available) */}
            <Stack.Screen name="+not-found" />

            {/* If you have an 'index.js' in the root, uncomment: */}
            {/* <Stack.Screen name="index" options={{ headerShown: false }} /> */}
          </Stack>
          <ToastContainer />
        </GestureHandlerRootView>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default RootLayout;
