import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

export const Input = React.forwardRef<TextInput, InputProps>(
  ({ label, error, leftIcon, rightIcon, style, ...props }, ref) => {
    return (
      <View className="mb-3">
        {label && (
          <Text className="mb-1 font-medium ml-1 text-gray-800">{label}</Text>
        )}
        <View
          className={`flex-row items-center overflow-hidden rounded-xl border bg-white
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${props.editable === false ? 'bg-gray-100' : ''}
          `}
        >
          {leftIcon && <View className="pl-3">{leftIcon}</View>}
          <TextInput
            ref={ref}
            className={`flex-1 px-4 py-3 h-16 text-gray-800
              ${leftIcon ? 'pl-3' : ''}
              ${rightIcon ? 'pr-3' : ''}
            `}
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
