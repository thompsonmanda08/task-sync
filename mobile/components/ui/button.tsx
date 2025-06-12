import { cn } from '@/lib/utils';
import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
  View,
} from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg';
  radius?: 'default' | 'sm' | 'lg' | 'full';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
  children: React.ReactNode;
  className?: string;
  loadingText?: string;
  classNames?: {
    container?: string;
    text?: string;
    icon?: string;
  };
}

export const Button = ({
  variant = 'default',
  size = 'default',
  radius = 'default',
  leftIcon,
  rightIcon,
  isLoading = false,
  loadingText,
  className = '',
  classNames = {},
  children,
  disabled,
  ...props
}: ButtonProps) => {
  const getContainerClasses = () => {
    let classes = 'flex-row items-center justify-center  ';

    // Size classes
    if (size === 'sm') {
      classes += 'px-3 py-3 ';
    } else if (size === 'lg') {
      classes += 'px-6 py-7 ';
    } else {
      classes += 'px-5 py-5 ';
    }

    if (radius === 'sm') {
      classes += 'rounded-sm ';
    } else if (radius === 'full') {
      classes += 'rounded-full ';
    } else {
      classes += 'rounded-2xl ';
    }

    // Variant classes
    if (variant === 'default') {
      classes += 'bg-primary ';
      classes += disabled || isLoading ? 'opacity-70 ' : '';
    } else if (variant === 'outline') {
      classes += 'border border-primary bg-transparent ';
      classes += disabled || isLoading ? 'opacity-50 ' : '';
    } else if (variant === 'ghost') {
      classes += 'bg-transparent ';
      classes += disabled || isLoading ? 'opacity-50 ' : '';
    } else if (variant === 'destructive') {
      classes += 'bg-red-500 ';
      classes += disabled || isLoading ? 'opacity-70 ' : '';
    } else if (variant === 'link') {
      classes += 'bg-transparent p-0 ';
    }

    return cn(classes, className, classNames?.container);
  };

  const getTextClasses = () => {
    let classes = 'font-medium ';

    // Size classes
    if (size === 'sm') {
      classes += 'text-sm ';
    } else if (size === 'lg') {
      classes += 'text-lg ';
    } else {
      classes += 'text-base ';
    }

    // Variant classes
    if (variant === 'default') {
      classes += 'text-white ';
    } else if (variant === 'outline') {
      classes += 'text-primary ';
    } else if (variant === 'ghost') {
      classes += 'text-primary ';
    } else if (variant === 'destructive') {
      classes += 'text-white ';
    } else if (variant === 'link') {
      classes += 'text-primary underline ';
    }

    return cn(classes, classNames?.text);
  };

  return (
    <TouchableOpacity
      className={getContainerClasses()}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <View className="flex-row items-center gap-">
          <ActivityIndicator
            size="small"
            color={
              variant === 'default' || variant === 'destructive'
                ? '#ffffff'
                : '#4D5DFA'
            }
            className="mr-2"
          />
          {loadingText && (
            <Text className={getTextClasses()}>
              {loadingText || 'Please wait...'}
            </Text>
          )}
        </View>
      ) : leftIcon ? (
        <View className={cn('mr-2', classNames?.icon)}>{leftIcon}</View>
      ) : null}

      {!isLoading && <Text className={getTextClasses()}>{children}</Text>}

      {rightIcon && !isLoading && (
        <View className={cn('ml-2', classNames?.icon)}>{rightIcon}</View>
      )}
    </TouchableOpacity>
  );
};
