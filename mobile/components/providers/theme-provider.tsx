// ThemeProvider.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'nativewind';
import { View } from 'react-native';

const ThemeContext = createContext<{
  theme: 'light' | 'dark';
  isDarkMode?: boolean;
  toggleTheme: () => void;
}>({
  theme: 'dark',
  isDarkMode: true,
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { colorScheme: theme, toggleColorScheme } = useColorScheme();

  // Persist the theme across app reloads
  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme =
        (await AsyncStorage.getItem('theme')) || theme || 'dark';

      if (storedTheme) {
        await AsyncStorage.setItem('theme', storedTheme);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    await AsyncStorage.setItem('theme', theme === 'dark' ? 'light' : 'dark');
    toggleColorScheme();
  };

  return (
    <ThemeContext.Provider value={{ theme: theme || 'dark', toggleTheme }}>
      <View
        className={theme === 'dark' ? `${theme || 'dark'} flex-1` : 'flex-1'}
      >
        {children}
      </View>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
