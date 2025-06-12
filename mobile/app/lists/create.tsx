import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTodoStore } from '@/store/todoStore';
import { colors } from '@/constants/colors';
import { Button } from '@/components/ui/button';

const colorOptions = [
  '#6366f1', // Indigo
  '#a5b4fc', // Light indigo
  '#22c55e', // Green
  '#ef4444', // Red
  '#f59e0b', // Amber
  '#3b82f6', // Blue
];

export default function CreateListScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ groupId?: string }>();
  const { addList, groups, currentUser, getGroupsByUser } = useTodoStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>(
    params.groupId,
  );

  const userGroups = getGroupsByUser(currentUser.id);

  const handleCreateList = () => {
    if (!title.trim()) return;

    addList({
      title: title.trim(),
      description: description.trim() || undefined,
      color: selectedColor,
      items: [],
      groupId: selectedGroupId,
    });

    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter list title"
          placeholderTextColor={colors.placeholder}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Description (optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter list description"
          placeholderTextColor={colors.placeholder}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Color</Text>
        <View style={styles.colorOptions}>
          {colorOptions.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorOption,
                { backgroundColor: color },
                selectedColor === color && styles.selectedColorOption,
              ]}
              onPress={() => setSelectedColor(color)}
            />
          ))}
        </View>
      </View>

      {userGroups.length > 0 && !params.groupId && (
        <View style={styles.formGroup}>
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

            {userGroups.map((group) => (
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
            ))}
          </View>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button onPress={handleCreateList} disabled={!title.trim()}>
          Create List
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
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
  buttonContainer: {
    marginTop: 20,
  },
});
