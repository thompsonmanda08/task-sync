import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { FolderOpen, ListChecks, User } from 'lucide-react-native';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { InitializeUserSession, useAuthStore } from '@/store/authStore';
import { colors, primary } from '@/constants/colors';
import { useEffect } from 'react';

export default function AppLayout() {
  useFrameworkReady();
  const { isAuthenticated, logout } = useAuthStore();

  // useEffect(() => {
  //   InitializeUserSession();
  // }, []);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView className="flex-1">
        <StatusBar style="dark" />
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: primary[500],
            tabBarInactiveTintColor: '#9E9E9E',
            tabBarStyle: {
              borderTopWidth: 1,
              borderTopColor: '#E0E0E0',
              height: Platform.OS === 'ios' ? 88 : 80,
              paddingBottom: Platform.OS === 'ios' ? 28 : 8,
              paddingTop: 8,
            },
            headerShown: false,
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'My Lists',
              tabBarIcon: ({ color, size }) => (
                <ListChecks size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="groups"
            options={{
              title: 'Groups',
              tabBarIcon: ({ color, size }) => (
                <FolderOpen size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: 'Profile',
              tabBarIcon: ({ color, size }) => (
                <User size={size} color={color} />
              ),
            }}
          />
        </Tabs>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
