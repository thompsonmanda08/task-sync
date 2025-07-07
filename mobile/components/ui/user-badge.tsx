import { User } from '@/types';
import { Image } from 'expo-image';
import { Star } from 'lucide-react-native';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface UserDetailsProps {
  user: Partial<User>;
}

export const UserDetails = ({ user }: UserDetailsProps) => {
  return (
    <TouchableOpacity
      className="flex-row items-center rounded-xl border border-border bg-card p-3 dark:border-dark-border dark:bg-dark-card"
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: user.profileImage }}
        style={{ width: 50, height: 50, borderRadius: 25 }}
      />

      <View className="ml-3 flex-1">
        <Text className="font-bold text-foreground/80 dark:text-dark-foreground/80">
          {user.name}
        </Text>
        <View className="mt-1 flex-row items-center">
          <Star size={14} color="#f59e0b" fill="#f59e0b" />
          <Text className="ml-1 text-xs text-gray-600">{user.rating} •</Text>
        </View>
      </View>

      <TouchableOpacity className="rounded-full bg-primary px-3 py-1.5 text-primary-foreground">
        <Text className="font-medium text-sm text-primary-foreground">
          See More
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};
