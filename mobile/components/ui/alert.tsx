import { cn } from '@/lib/utils';
import React from 'react';
import { View, Text } from 'react-native';

interface AlertTagProps {
  text: string;
  color?: 'default' | 'warning' | 'error';
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'link';
  Icon?: React.ReactNode;
  size?: 'sm' | 'lg';
  className?: string;
  classNames?: {
    container?: string;
    text?: string;
    icon?: string;
  };
}

export const AlertBox = ({
  text,
  Icon,
  size,
  variant,
  color,
  className,
  classNames,
}: AlertTagProps) => {
  const getContainerClasses = () => {
    let classes = 'flex-row items-center justify-center !rounded-lg p-4 ';

    // Size classes
    if (size === 'sm') {
      classes += 'px-3 py-2 ';
    } else if (size === 'lg') {
      classes += 'px-6 py-6 ';
    } else {
      classes += 'px-5 py-4 ';
    }

    // Color classes
    if (color === 'warning') {
      classes += 'bg-warning/10 ';
    } else if (color === 'error') {
      classes += 'bg-error/10 ';
    } else {
      classes += 'bg-primary-100 ';
    }

    // Variant classes
    // if (variant === 'default') {
    //   classes += 'bg-primary ';
    // } else if (variant === 'outlined') {
    //   classes += 'border border-primary bg-transparent ';
    // }

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

    // Color classes
    if (color === 'warning') {
      classes += 'text-warning ';
    } else if (color === 'error') {
      classes += 'text-error ';
    } else {
      classes += 'text-primary0 ';
    }

    // Variant classes
    // if (variant === 'outline') {
    //   classes += 'text-primary-800 ';
    // } else if (variant === 'ghost') {
    //   classes += 'text-primary-800 ';
    // } else if (variant === 'destructive') {
    //   classes += 'text-error ';
    // } else {
    //   classes += 'text-primary ';
    // }

    return cn(classes, classNames?.text);
  };

  // Split the class string by spaces to handle the different parts

  return (
    <View className={getContainerClasses()}>
      {Icon && <View className={cn('pr-2 ', classNames?.icon)}>{Icon}</View>}
      <Text className={getTextClasses()}>{text}</Text>
    </View>
  );
};
