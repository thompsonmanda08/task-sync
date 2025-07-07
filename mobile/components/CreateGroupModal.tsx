import { X } from 'lucide-react-native';
import React, { useState } from 'react';
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
} from 'react-native';

import { colors } from '@/constants/colors';
import { Group } from '@/types';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { createNewGroup, updateGroup } from '@/controllers/group-actions';
import { notify } from './ui/toast-container';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants';

interface CreateGroupModalProps {
  visible: boolean;
  onClose: () => void;
  initialValues?: Partial<Group>;
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  visible,
  onClose,
  initialValues,
}) => {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<
    Omit<
      Group,
      | 'id'
      | 'lists'
      | 'members'
      | 'lists_count'
      | 'owner_id'
      | 'created_at'
      | 'owner'
      | 'members_count'
    >
  >({
    name: initialValues?.name || '',
    description: initialValues?.description || '',
  });

  function updateFormData(fields: Partial<Group>) {
    setFormData((prev) => {
      return {
        ...prev,
        ...fields,
      };
    });
  }

  const handleSave = async () => {
    if (!formData.name.trim()) return;

    const payload = {
      name: formData.name.trim(),
      description: formData.description?.trim() || undefined,
    };

    const response = initialValues
      ? await updateGroup(payload)
      : await createNewGroup(payload);

    if (response?.success) {
      notify({
        title: 'Success',
        message: `Group ${initialValues ? 'updated' : 'created'} successfully`,
        type: 'success',
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GROUP_LISTS] });
    } else {
      notify({
        title: 'Failed',
        message: `Failed to ${initialValues ? 'update' : 'create'} a group`,
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
            <View
              style={styles.container}
              className="bg-card dark:bg-dark-card rounded-t-3xl"
            >
              <View style={styles.header}>
                <Text style={styles.headerTitle}>
                  {initialValues ? 'Edit Group' : 'New Group'}
                </Text>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <X size={20} color={colors.text} />
                </TouchableOpacity>
              </View>

              <ScrollView className="p-4">
                <Input
                  label="Name"
                  value={formData.name}
                  onChangeText={(name) => updateFormData({ name })}
                  placeholder="Enter group name"
                  placeholderTextColor={colors.placeholder}
                  autoFocus
                />
                <Input
                  label="Description"
                  style={[styles.textArea]}
                  value={formData.description}
                  onChangeText={(description) =>
                    updateFormData({ description })
                  }
                  placeholder="Add description"
                  placeholderTextColor={colors.placeholder}
                  multiline
                  numberOfLines={Platform.OS === 'ios' ? 0 : 2}
                  textAlignVertical="top"
                />

                <Button
                  onPress={handleSave}
                  isLoading={isSubmitting}
                  disabled={!formData.name.trim() || isSubmitting}
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
