import React from 'react';
import { Text, View, ActivityIndicator } from 'react-native';

import { cn } from '@/lib/utils';
import { colors } from '@/constants/colors';

type SpinnerProps = {
  size?: number | 'small' | 'large';
  loadingText?: string;
  className?: string;
  classNames?: {
    base?: string;
    indicator?: string;
    text?: string;
  };
};

export const Spinner = ({
  loadingText,
  size = 'large',
  className = '',
  classNames = {},
}: SpinnerProps) => {
  return (
    <View
      className={cn(
        'flex-1 items-center justify-center',
        className,
        classNames.base,
      )}
    >
      <ActivityIndicator
        size={size}
        color={colors.primary}
        className={cn('mb-2', classNames.indicator)}
      />
      {loadingText && (
        <Text
          className={cn(
            'font-semibold text-lg text-foreground dark:text-primary',
            classNames.text,
          )}
        >
          {loadingText}
        </Text>
      )}
    </View>
  );
};
