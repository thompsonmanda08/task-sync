import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Bell, ArrowLeft } from 'lucide-react-native';
import { navigate } from 'expo-router/build/global-state/routing';
import { useNavigation } from '@react-navigation/native';
import { cn } from '@/lib/utils';
import { gary } from '@/constants/colors';

interface AppBarProps {
  title: string;
  showBack?: boolean;
  showNotification?: boolean;
  rightIcon?: React.ComponentType<any>;
  onRightIconPress?: () => void;
  classNames?: {
    backButton?: string;
  };
}

export default function AppBar({
  title,
  showBack = false,
  showNotification = false,
  rightIcon: RightIcon,
  onRightIconPress,
  classNames,
}: AppBarProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const navigation = useNavigation();

  return (
    <View
      style={[
        {
          paddingTop: insets.top || 16,
          height: (insets.top || 16) + 60,
        },
      ]}
      className="bg-background dark:bg-dark-background z-10 border-b border-gray-200"
    >
      <View
        // style={styles.contentContainer}
        className="flex-1 flex-row items-center justify-between px-4"
      >
        {showBack && (
          <TouchableOpacity
            // style={styles.backButton}
            className={cn('mr-4 p-3', classNames?.backButton)}
            onPress={() => {
              if (navigation.canGoBack()) {
                router.back();
              }
            }}
          >
            <ArrowLeft size={24} color={gary[800]} />
          </TouchableOpacity>
        )}

        <Text className="text-lg font-bold text-left flex-1">{title}</Text>

        <View
          // style={styles.rightContainer}
          className="flex-row items-center"
        >
          {showNotification && (
            <TouchableOpacity
              // style={styles.iconButton}
              className="w-12 h-12 items-center justify-center"
            >
              <Bell size={24} color="#212121" />
              <View
                // style={styles.notificationBadge}
                className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary-500"
              />
            </TouchableOpacity>
          )}

          {RightIcon && (
            <TouchableOpacity
              // style={styles.iconButton}
              onPress={onRightIconPress}
            >
              <RightIcon size={24} color="#212121" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}
