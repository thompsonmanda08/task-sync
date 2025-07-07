import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTodoStore } from '@/store/todoStore';
import { colors } from '@/constants/colors';
import { Button } from '@/components/ui/button';

export default function CreateGroupScreen() {
  const router = useRouter();
  const { addGroup } = useTodoStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleCreateGroup = () => {
    if (!name.trim()) return;

    addGroup({
      name: name.trim(),
      description: description.trim() || undefined,
      lists: [],
      members: [],
    });

    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter group name"
          placeholderTextColor={colors.placeholder}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Description (optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter group description"
          placeholderTextColor={colors.placeholder}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button onPress={handleCreateGroup} disabled={!name.trim()}>
          Create Group
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
  buttonContainer: {
    marginTop: 20,
  },
});
