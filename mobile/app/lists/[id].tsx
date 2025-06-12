import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ChevronLeft,
  ClipboardList,
  Share2,
  Trash2,
  Undo2,
} from 'lucide-react-native';
import { useTodoStore } from '@/store/todoStore';

import { colors, primary } from '@/constants/colors';
import { Role, TodoItem as TodoItemType } from '@/types';
import { TodoItem } from '@/components/TodoListItem';
import { Button } from '@/components/ui/button';
import { AddTodoInput } from '@/components/AddTodoInput';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppBar from '@/components/ui/appbar';
import { useNavigation } from '@react-navigation/native';
import { EmptyState } from '@/components/EmptyState';

export default function ListDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getListById, addTodoItem, deleteList, currentUser, getUserById } =
    useTodoStore();

  const list = getListById(id);

  if (!list) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>List not found</Text>
        <Button onPress={() => router.back()}>Go Back</Button>
      </View>
    );
  }

  const userRole =
    list.shared.find((m) => m.userId === currentUser.id)?.role || 'viewer';
  const canEdit = userRole === 'owner' || userRole === 'contributor';

  const handleAddTodo = (title: string) => {
    addTodoItem(list.id, { title, completed: false });
  };

  const handleShareList = () => {
    router.push(`/lists/share/${list.id}`);
  };

  const handleDeleteList = () => {
    Alert.alert(
      'Delete List',
      'Are you sure you want to delete this list? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteList(list.id);
            router.back();
          },
        },
      ],
    );
  };

  const navigation = useNavigation();

  const renderItem = ({ item }: { item: TodoItemType }) => (
    <TodoItem item={item} listId={list.id} canEdit={canEdit} />
  );

  const renderListHeader = () => (
    <View style={styles.header} className="relative mb-4">
      <View
        style={[
          styles.colorIndicator,
          { backgroundColor: list.color || colors.primary },
        ]}
      />
      <View style={styles.headerContent}>
        <Text style={styles.title}>{list.title}</Text>
        {list.description ? (
          <Text style={styles.description}>{list.description}</Text>
        ) : null}

        <View style={styles.meta}>
          <Text style={styles.metaText}>
            Created by {getUserById(list.createdBy)?.name || 'Unknown'}
          </Text>
          <Text style={styles.metaText}>
            {list.items.length} item{list.items.length !== 1 ? 's' : ''}
          </Text>
        </View>

        <View className="flex-row gap-2">
          <Button
            size="sm"
            variant="outline"
            className="py-0"
            onPress={() => {
              if (navigation.canGoBack()) {
                router.back();
              }
            }}
          >
            <Undo2 size={16} color={colors.primary} />
          </Button>
          <Button
            onPress={handleShareList}
            leftIcon={<Share2 size={16} color={colors.white} />}
            className="py-2"
            size="sm"
          >
            Share
          </Button>
          {userRole === 'owner' && (
            <Button
              onPress={handleDeleteList}
              leftIcon={<Trash2 size={16} color="#fff" />}
              variant="destructive"
              size="sm"
              className="py-2"
              style={{ marginLeft: 8 }}
            >
              Delete
            </Button>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-dark-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        enabled
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20} // Adjust as needed
      >
        <View className="flex-1">
          <FlatList
            data={list.items}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={renderListHeader}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View className="flex-1 h-full aspect-square items-center justify-center">
                <EmptyState
                  title="No Tasks"
                  message="Create your first todo item"
                  icon={<ClipboardList size={48} color={primary[300]} />}
                />
              </View>
            }
            showsVerticalScrollIndicator={false}
          />

          <View className="bg-card px-4 dark:bg-dark-background">
            <AddTodoInput
              onAdd={handleAddTodo}
              //  disabled={!canEdit}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  colorIndicator: {
    width: 4,
    height: '100%',
    borderRadius: 2,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: colors.placeholder,
    marginBottom: 16,
  },
  meta: {
    marginBottom: 16,
  },
  metaText: {
    fontSize: 14,
    color: colors.placeholder,
    marginBottom: 4,
  },
  actions: {
    flexDirection: 'row',
  },
  deleteButton: {
    marginLeft: 8,
  },
  listContent: {
    paddingBottom: 80,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.light,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  errorText: {
    fontSize: 18,
    color: colors.danger,
    marginBottom: 16,
    textAlign: 'center',
  },
});
