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
import { Group, TodoList } from '@/types';
import { Input } from './ui/input';
import { useGroups } from '@/hooks/use-query-hooks';
import { cn } from '@/lib/utils';
import { useLocalSearchParams } from 'expo-router';
import { Button } from './ui/button';
import { createNewList, updateList } from '@/controllers/list-actions';
import { notify } from './ui/toast-container';
import { QUERY_KEYS } from '@/constants';
import { useQueryClient } from '@tanstack/react-query';

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
  initialValues?: TodoList;
}

export const CreateListModal: React.FC<CreateListModalProps> = ({
  visible,
  onClose,
  initialValues,
}) => {
  const queryClient = useQueryClient();
  const params = useLocalSearchParams<{ groupId?: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>(
    params.groupId,
  );

  // const { data: groupsRes } = useGroups();
  // const userGroups = (groupsRes?.data || []) as Group[];

  const [formData, setFormData] = useState<
    Omit<
      TodoList,
      | 'id'
      | 'todo_items'
      | 'todo_items_count'
      | 'completed_count'
      | 'created_at'
      | 'updated_at'
      | 'owner_id'
      | 'created_by'
      | 'shared_with'
      | 'shared_with_count'
    >
  >({
    name: initialValues?.name || '',
    description: initialValues?.description || '',
    color: initialValues?.color || colorOptions[0],
    group_id: initialValues?.group_id || '',
  });

  const titleInputRef = useRef<RNTextInput>(null);
  const descriptionInputRef = useRef<RNTextInput>(null);

  function updateFormData(fields: Partial<TodoList>) {
    setFormData((prev) => {
      return {
        ...prev,
        ...fields,
      };
    });
  }

  const handleSave = async () => {
    const name = formData?.name?.trim() || '';
    const description = formData?.description?.trim() || '';
    const color = formData?.color || colorOptions[0];
    const group_id = formData?.group_id || '';

    if (!name) return;

    const payload = {
      name,
      description,
      color,
      group_id,
    };

    setIsSubmitting(true);

    const response = initialValues
      ? await updateList(payload, initialValues?.id)
      : await createNewList(payload);

    if (response?.success) {
      notify({
        title: 'Success',
        message: `Todo List ${initialValues ? 'updated' : 'created'} successfully`,
        type: 'success',
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_LISTS] });
    } else {
      notify({
        title: 'Failed',
        message: `Failed to ${initialValues ? 'update' : 'create'} a list`,
        type: 'error',
      });
    }

    setIsSubmitting(false);

    resetForm();
    onClose();
  };

  const resetForm = () => {
    updateFormData({
      name: '',
      color: '',
      description: '',
    });
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
        className="flex-1"
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
                    label="List Name"
                    style={styles.input}
                    value={formData?.name}
                    onChangeText={(name) => updateFormData({ name })}
                    placeholder="Enter list name"
                    placeholderTextColor={colors.placeholder}
                    autoFocus
                    ref={titleInputRef}
                    returnKeyType="next"
                    onSubmitEditing={() => descriptionInputRef.current?.focus()}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Input
                    label="Description (optional)"
                    style={[styles.input, styles.textArea]}
                    value={formData?.description}
                    onChangeText={(description) =>
                      updateFormData({ description })
                    }
                    placeholder="Add description"
                    placeholderTextColor={colors.placeholder}
                    multiline
                    numberOfLines={Platform.OS === 'ios' ? 0 : 2}
                    textAlignVertical="top"
                    returnKeyType="done"
                    ref={descriptionInputRef}
                    onSubmitEditing={() => Keyboard.dismiss()}
                  />
                </View>

                {/* COLOR CHOICE */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Color</Text>
                  <View style={styles.colorOptions}>
                    {colorOptions.map((colorOption) => (
                      <TouchableOpacity
                        key={colorOption}
                        style={[
                          styles.colorOption,
                          { backgroundColor: colorOption },
                          formData?.color === colorOption &&
                            styles.colorOptionSelected,
                        ]}
                        onPress={() => updateFormData({ color: colorOption })}
                      />
                    ))}
                  </View>
                </View>

                {/* TODO: ADD A GROUP TO A LIST */}
                {/* {userGroups.length > 0 && !params.groupId && (
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Add to Group (optional)</Text>
                    <View style={styles.groupOptions}>
                      <TouchableOpacity
                        style={[
                          styles.groupOption,
                          selectedGroupId === undefined &&
                            styles.selectedGroupOption,
                        ]}
                        onPress={() => setSelectedGroupId(undefined)}
                      >
                        <Text
                          style={[
                            styles.groupOptionText,
                            selectedGroupId === undefined &&
                              styles.selectedGroupOptionText,
                          ]}
                        >
                          None
                        </Text>
                      </TouchableOpacity>

                      {userGroups.map((group) => (
                        <TouchableOpacity
                          key={group.id}
                          className={cn('mb-5', {
                            'border border-primary':
                              selectedGroupId === group.id,
                          })}
                          onPress={() => updateFormData({ group_id: group.id })}
                        >
                          <Text
                            style={[
                              styles.groupOptionText,
                              selectedGroupId === group.id &&
                                styles.selectedGroupOptionText,
                            ]}
                          >
                            {group.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )} */}

                <Button
                  isLoading={isSubmitting}
                  onPress={handleSave}
                  disabled={!formData?.name?.trim() || isSubmitting}
                >
                  {initialValues ? 'Update' : 'Create'}
                </Button>
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
  formGroup: {
    marginBottom: 20,
  },
  selectedColorOption: {
    borderWidth: 3,
    borderColor: colors.text,
  },
  groupOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  groupOption: {
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedGroupOption: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  groupOptionText: {
    fontSize: 14,
    color: colors.text,
  },
  selectedGroupOptionText: {
    color: '#fff',
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
