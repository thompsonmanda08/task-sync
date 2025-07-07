import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { ListCheckIcon, Plus } from 'lucide-react-native';
import { colors, gary } from '@/constants/colors';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface AddTodoInputProps {
  onAdd: (title: string) => void;
  placeholder?: string;
  themeColor?: string;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

export const AddTodoInput: React.FC<AddTodoInputProps> = ({
  onAdd,
  placeholder = 'Create a new task...',
  disabled = false,
  isLoading = false,
  className,
  themeColor,
}) => {
  const [text, setText] = useState('');

  const handleAdd = () => {
    if (text.trim() && !disabled) {
      onAdd(text.trim());
      setText('');
    }
  };

  return (
    <View className={cn('flex-row gap-4 w-full relative', className)}>
      <Input
        // style={{
        //   borderColor: themeColor || undefined,
        // }}
        leftIcon={<ListCheckIcon size={20} color={gary[500]} />}
        classNames={{
          inputWrapper: 'border-none border-0 outline-none',
          wrapper: 'mb-0 flex-1',
          input:
            'border-b border-gray-300 flex-1 focus:border-primary active:border-primary outline-none',
        }}
        value={text}
        onChangeText={setText}
        placeholder={placeholder}
        placeholderTextColor={gary[500]}
        returnKeyType="done"
        onSubmitEditing={handleAdd}
        editable={!disabled}
      />
      <Button
        style={{
          backgroundColor: themeColor || colors.primary,
        }}
        className="rounded-full aspect-square w-16 h-16 p-2 "
        onPress={handleAdd}
        disabled={disabled || !text.trim()}
        isLoading={isLoading}
      >
        <Plus size={24} color="#fff" />
      </Button>
    </View>
  );
};
