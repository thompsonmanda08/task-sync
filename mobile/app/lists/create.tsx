import React, { useRef, useState } from 'react';
import {
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router, useLocalSearchParams, useRouter } from 'expo-router';
import { useTodoStore } from '@/store/todoStore';
import { colors } from '@/constants/colors';
import { Button } from '@/components/ui/button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGroups } from '@/hooks/use-query-hooks';
import { TodoList } from '@/types';
import { Input } from '@/components/ui/input';
import AppBar from '@/components/ui/appbar';
import { createNewList, updateList } from '@/controllers/list-actions';
import { QUERY_KEYS } from '@/constants';
import { notify } from '@/components/ui/toast-container';
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

export default function CreateOrUpdateListScreen({}) {
  const queryClient = useQueryClient();
  const params = useLocalSearchParams<{ groupId?: string; listId?: string }>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>(
    params.groupId,
  );
  const [selectedListId, setSelectedListId] = useState<string | undefined>(
    params.listId,
  );
  console.log('GROUP-ID: ', selectedGroupId);
  console.log('LIST-ID: ', selectedListId);

  // TODO: CREATE A LIST FROM HOME ANDD POINT TO A GROUP IF NO GROUP ID PROVIDED
  // const { data: groupsRes } = useGroups();
  // const userGroups = (groupsRes?.data || []) as Group[];

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: colorOptions[0],
    group_id: selectedGroupId,
  } as Partial<TodoList>);

  const titleInputRef = useRef<TextInput>(null);
  const descriptionInputRef = useRef<TextInput>(null);

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
    const group_id = formData?.group_id || selectedListId || '';

    if (!name) return;

    const payload = {
      name,
      description,
      color,
      group_id,
    };

    setIsSubmitting(true);

    const response = selectedListId
      ? await updateList(payload, selectedListId)
      : await createNewList(payload);

    if (response?.success) {
      notify({
        title: 'Success',
        message: `Todo List ${selectedListId ? 'updated' : 'created'} successfully`,
        type: 'success',
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_LISTS] });
      resetForm();
      router.back();
    } else {
      notify({
        title: 'Failed',
        message: `Failed to ${selectedListId ? 'update' : 'create'} a list`,
        type: 'error',
      });
    }

    setIsSubmitting(false);

    // resetForm();
    // router.back();
  };

  const resetForm = () => {
    updateFormData({
      name: '',
      color: '',
      description: '',
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background py-4">
      <AppBar title={'Back'} showBack />
      <ScrollView
        // style={styles.container}
        // contentContainerStyle={styles.content}
        className="flex-1 gap-4 px-5"
      >
        <View className="">
          <Text className="text-xl font-bold text-left mt-4">
            {selectedListId ? 'Edit List' : 'Create New List'}
          </Text>
        </View>
        <View className="mt-4 gap-4">
          <Input
            label="List Name"
            // style={styles.input}
            value={formData?.name}
            onChangeText={(name) => updateFormData({ name })}
            placeholder="Enter list name"
            placeholderTextColor={colors.placeholder}
            autoFocus
            ref={titleInputRef}
            returnKeyType="next"
            onSubmitEditing={() => descriptionInputRef.current?.focus()}
          />
          <Input
            label="Description (optional)"
            // style={[styles.input, styles.textArea]}
            value={formData?.description}
            onChangeText={(description) => updateFormData({ description })}
            placeholder="Add description"
            placeholderTextColor={colors.placeholder}
            multiline
            numberOfLines={Platform.OS === 'ios' ? 0 : 2}
            textAlignVertical="top"
            returnKeyType="done"
            ref={descriptionInputRef}
            onSubmitEditing={() => Keyboard.dismiss()}
          />
          {/* COLOR CHOICE */}
          <View className="mb-4">
            <Text style={styles.label}>List Color</Text>
            <View style={styles.colorOptions}>
              {colorOptions.map((colorOption) => (
                <TouchableOpacity
                  key={colorOption}
                  style={[
                    styles.colorOption,
                    { backgroundColor: colorOption },
                    formData?.color === colorOption &&
                      styles.selectedColorOption,
                  ]}
                  onPress={() => updateFormData({ color: colorOption })}
                />
              ))}
            </View>
          </View>

          {/*  */}
          {[1, 2].length > 0 && !params.groupId && (
            <View className="mb-4">
              <Text style={styles.label}>Add to Group (optional)</Text>
              <View style={styles.groupOptions}>
                <TouchableOpacity
                  style={[
                    styles.groupOption,
                    selectedGroupId === undefined && styles.selectedGroupOption,
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

                {/* {userGroups.map((group) => (
                <TouchableOpacity
                  key={group.id}
                  style={[
                    styles.groupOption,
                    selectedGroupId === group.id && styles.selectedGroupOption,
                  ]}
                  onPress={() => setSelectedGroupId(group.id)}
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
              ))} */}
              </View>
            </View>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <Button
            isLoading={isSubmitting}
            onPress={handleSave}
            disabled={!formData.name?.trim()}
          >
            Create List
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    minHeight: 100,
  },
  colorOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    marginBottom: 12,
  },
  selectedColorOption: {
    borderWidth: 3,
    borderColor: colors.background,
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
  buttonContainer: {
    marginTop: 20,
  },
});
