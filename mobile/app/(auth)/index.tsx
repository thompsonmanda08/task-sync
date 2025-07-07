import { Redirect, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import images from '@/constants/images';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { AuthBottomSheet } from '@/components/auth/AuthBottomSheet';
import { useAuthStore } from '@/store/authStore';

export default function App() {
  const [isAuthSheetVisible, setIsAuthSheetVisible] = useState(false);
  const { isAuthenticated } = useAuthStore();

  // AUTHENTICATED
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  // NOT AUTHENTICATED
  return (
    <SafeAreaView className="bg-primary-950 h-full">
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View className="items-center justify-center+ gap-4 w-full min-h-[85vh] px-4 py-8">
          <Image
            source={images.wordmark_yellow}
            className="w-[280px] h-[90px]"
            resizeMode="contain"
          />
          <Image
            source={images.cards}
            className="w-full max-w-[380px] h-[300px]"
            resizeMode="contain"
          />

          <View className="flex justify-center items-center mt-4 max-w-[380px] gap-4">
            <Text className="text-4xl text-white text-center font-bold">
              Work Smarter. Create Better.{' '}
            </Text>
            <Text className="text-secondary text-4xl font-bold">TaskSync.</Text>
          </View>
          <Text className="text-gray-200 text-2xl mt-4  text-center font-serif mb-4">
            Innovate effortlessly. Stay perfectly synced.
          </Text>
          <Button
            className={cn('w-full')}
            onPress={() => setIsAuthSheetVisible(true)}
          >
            Get Started
          </Button>
        </View>
      </ScrollView>
      <AuthBottomSheet
        visible={isAuthSheetVisible}
        onClose={() => setIsAuthSheetVisible(false)}
      />
    </SafeAreaView>
  );
}
