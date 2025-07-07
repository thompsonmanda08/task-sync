import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/colors';
import images from '@/constants/images';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: React.ReactNode;
  buttonLeftIcon?: React.ReactNode;
  buttonRightIcon?: React.ReactNode;
  buttonTitle?: string;
  onButtonPress?: () => void;
  classNames?: {
    buttonWrapper?: string;
    button?: string;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  icon,
  buttonTitle,
  onButtonPress,
  buttonLeftIcon,
  buttonRightIcon,
  classNames,
}) => {
  return (
    <View style={styles.container}>
      {icon ? (
        <View style={styles.iconContainer}>{icon}</View>
      ) : (
        <Image
          source={images.empty}
          className="w-full max-w-[180px] h-[100px] mb-2 opacity-85"
          resizeMode="contain"
        />
      )}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {buttonTitle && onButtonPress && (
        <View
          className={cn(
            'flex items-center justify-center mt-4',
            classNames?.buttonWrapper,
          )}
        >
          <Button
            onPress={onButtonPress}
            leftIcon={buttonLeftIcon}
            rightIcon={buttonRightIcon}
            className={classNames?.button}
          >
            {buttonTitle}
          </Button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: '80%',
  },
});
