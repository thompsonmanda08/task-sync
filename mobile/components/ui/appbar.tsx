import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Bell, ArrowLeft } from 'lucide-react-native';
import { navigate } from 'expo-router/build/global-state/routing';
import { useNavigation } from '@react-navigation/native';

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
        styles.container,
        {
          paddingTop: insets.top || 16,
          height: (insets.top || 16) + 60,
        },
      ]}
    >
      <View style={styles.contentContainer}>
        {showBack && (
          <TouchableOpacity
            style={styles.backButton}
            className={classNames?.backButton}
            onPress={() => {
              if (navigation.canGoBack()) {
                router.back();
              }
            }}
          >
            <ArrowLeft size={24} color="#212121" />
          </TouchableOpacity>
        )}

        <Text style={styles.title}>{title}</Text>

        <View style={styles.rightContainer}>
          {showNotification && (
            <TouchableOpacity style={styles.iconButton}>
              <Bell size={24} color="#212121" />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
          )}

          {RightIcon && (
            <TouchableOpacity
              style={styles.iconButton}
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    zIndex: 10,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
    flex: 1,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4D5DFA',
  },
});
