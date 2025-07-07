import { cn } from '@/lib/utils';
import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  classNames?: {
    wrapper?: string;
    inputWrapper?: string;
    input?: string;
    label?: string;
  };
};

export const Input = React.forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      leftIcon,
      rightIcon,
      // style,
      classNames,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <View className={cn('mb-3 flex-1', classNames?.wrapper)}>
        {label && (
          <Text
            className={cn(
              'mb-1 font-medium ml-1 text-gray-800',
              classNames?.label,
            )}
          >
            {label}
          </Text>
        )}
        <View
          className={cn(
            `flex-row items-center overflow-hidden rounded-xl border border-gray-300 bg-transparent `,
            {
              'border-red-500': error,
              'bg-gray-100': props.editable === false,
            },
            classNames?.inputWrapper,
          )}
        >
          {leftIcon && <View className="pl-3">{leftIcon}</View>}
          <TextInput
            ref={ref}
            className={cn(
              `px-4 py-3 h-16 text-gray-800 flex-1
              ${leftIcon ? 'pl-3' : ''}
              ${rightIcon ? 'pr-3' : ''}
            `,
              className,
              classNames?.input,
            )}
            placeholderTextColor="#94a3b8"
            {...props}
          />
          {rightIcon && <View className="pr-4">{rightIcon}</View>}
        </View>
        {error && <Text className="mt-1 text-sm text-red-500">{error}</Text>}
      </View>
    );
  },
);
