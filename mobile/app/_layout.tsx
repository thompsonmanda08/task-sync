import '../global.css';

import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Redirect, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Image, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ThemeProvider, useTheme } from '@/components/providers/theme-provider';
import ToastContainer from '@/components/ui/toast-container';
import images from '@/constants/images';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import SplashScreenView from '@/components/SplashScreen';
import { colors } from '@/constants/colors';

const queryClient = new QueryClient();

// Ensure splash screen stays visible while fonts load
SplashScreen.preventAutoHideAsync();

function RootLayout() {
  useFrameworkReady();
  const [appIsReady, setAppIsReady] = useState(false);
  const { theme } = useTheme();

  useFrameworkReady();

  const [fontsLoaded, error] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-Bold': Inter_700Bold,
    BadScript: require('../assets/fonts/BadScript-Regular.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || (error && !appIsReady)) {
      // Hide splash screen once fonts are loaded
      SplashScreen.hideAsync();
      setTimeout(() => {
        SplashScreen.hide();
        setAppIsReady(true);
      }, 3000);
    }
  }, [fontsLoaded, error]);

  // Return Splash view until fonts are loaded
  if (!appIsReady || (!fontsLoaded && !error)) {
    return <SplashScreenView onAnimationComplete={() => {}} />;
  }

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }} className="">
          <StatusBar style="dark" backgroundColor={colors.white} />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <ToastContainer />
        </GestureHandlerRootView>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default RootLayout;
