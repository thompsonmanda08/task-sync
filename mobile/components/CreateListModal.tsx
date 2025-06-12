import { X } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  TextInput as RNTextInput,
} from 'react-native';

import { colors } from '@/constants/colors';
import { TodoList } from '@/types';
import { Input } from './ui/input';

const colorOptions = [
  '#4A6FA5', // Primary
  '#F9C784', // Accent
  '#95D5B2', // Success
  '#F08080', // Danger
  '#9CB4CC', // Secondary
  '#6366F1', // Indigo
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Violet
];

interface CreateListModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (
    list: Omit<
      TodoList,
      'id' | 'createdAt' | 'updatedAt' | 'ownerId' | 'shared' | 'items'
    >,
  ) => void;
  initialValues?: Partial<TodoList>;
}

export const CreateListModal: React.FC<CreateListModalProps> = ({
  visible,
  onClose,
  onSave,
  initialValues,
}) => {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(
    initialValues?.description || '',
  );
  const [color, setColor] = useState(initialValues?.color || colorOptions[0]);

  const titleInputRef = useRef<RNTextInput>(null);
  const descriptionInputRef = useRef<RNTextInput>(null);

  const handleSave = () => {
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      color,
    });

    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setColor(colorOptions[0]);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        enabled
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20} // Adjust as needed
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.overlay}>
            <View style={styles.container}>
              <View style={styles.header}>
                <Text style={styles.headerTitle}>
                  {initialValues ? 'Edit List' : 'Create New List'}
                </Text>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <X size={20} color={colors.text} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.form}>
                <View style={styles.inputGroup}>
                  <Input
                    label="Title"
                    style={styles.input}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Enter list title"
                    placeholderTextColor={colors.placeholder}
                    autoFocus
                    returnKeyType="next"
                    ref={titleInputRef}
                    onSubmitEditing={() => descriptionInputRef.current?.focus()}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Input
                    label="Description (optional)"
                    style={[styles.input, styles.textArea]}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Add description"
                    placeholderTextColor={colors.placeholder}
                    multiline
                    numberOfLines={Platform.OS === 'ios' ? 0 : 3}
                    textAlignVertical="top"
                    returnKeyType="done"
                    ref={descriptionInputRef}
                    onSubmitEditing={() => Keyboard.dismiss()}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Color</Text>
                  <View style={styles.colorOptions}>
                    {colorOptions.map((colorOption) => (
                      <TouchableOpacity
                        key={colorOption}
                        style={[
                          styles.colorOption,
                          { backgroundColor: colorOption },
                          color === colorOption && styles.colorOptionSelected,
                        ]}
                        onPress={() => setColor(colorOption)}
                      />
                    ))}
                  </View>
                </View>

                <TouchableOpacity
                  style={[
                    styles.saveButton,
                    !title.trim() && styles.saveButtonDisabled,
                  ]}
                  onPress={handleSave}
                  disabled={!title.trim()}
                >
                  <Text style={styles.saveButtonText}>
                    {initialValues ? 'Update' : 'Create'}
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 16,
    position: 'relative',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    minHeight: 80,
    paddingTop: 12,
  },
  colorOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  colorOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
    marginBottom: 12,
  },
  colorOptionSelected: {
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonDisabled: {
    backgroundColor: colors.border,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
