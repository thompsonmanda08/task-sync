import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Plus } from 'lucide-react-native';
import { colors, gary } from '@/constants/colors';

interface AddTodoInputProps {
  onAdd: (title: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const AddTodoInput: React.FC<AddTodoInputProps> = ({
  onAdd,
  placeholder = 'Add a new task...',
  disabled = false,
}) => {
  const [text, setText] = useState('');

  const handleAdd = () => {
    if (text.trim() && !disabled) {
      onAdd(text.trim());
      setText('');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder={placeholder}
        placeholderTextColor={gary[400]}
        returnKeyType="done"
        onSubmitEditing={handleAdd}
        editable={!disabled}
      />
      <TouchableOpacity
        style={[styles.addButton, disabled && styles.disabledButton]}
        onPress={handleAdd}
        disabled={disabled || !text.trim()}
      >
        <Plus size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 4,
    paddingInlineEnd: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: 12,
    fontSize: 16,
    color: colors.text,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: colors.placeholder,
  },
});
