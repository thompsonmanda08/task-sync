import React from 'react';
import { View, Text } from 'react-native';

interface BadgeTagProps {
  text: string;
}

export const Badge = ({ text }: BadgeTagProps) => {
  const getTagStyle = () => {
    switch (text.toLowerCase()) {
      case 'music':
        return 'bg-indigo-100 text-indigo-800';
      case 'sports':
        return 'bg-blue-100 text-blue-800';
      case 'arts':
        return 'bg-purple-100 text-purple-800';
      case 'food':
        return 'bg-orange-100 text-orange-800';
      case 'tech':
        return 'bg-teal-100 text-teal-800';
      case 'business':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-primary-100 text-primary-800';
    }
  };

  // Split the class string by spaces to handle the different parts
  const [bgColor, textColor] = getTagStyle().split(' ');

  return (
    <View className={`px-2 py-0.5 rounded-full ${bgColor}`}>
      <Text className={`text-xs font-medium ${textColor}`}>
        {text.toUpperCase()}
      </Text>
    </View>
  );
};
