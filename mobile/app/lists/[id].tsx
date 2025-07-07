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
  ArrowLeft,
  ChevronLeft,
  ClipboardList,
  ListPlusIcon,
  Share2,
  Trash2,
  Undo2,
} from 'lucide-react-native';
import { useTodoStore } from '@/store/todoStore';

import { colors, primary } from '@/constants/colors';
import { Role, TodoItem as TodoItemType, TodoList } from '@/types';
import { TodoItem } from '@/components/TodoListItem';
import { Button } from '@/components/ui/button';
import { AddTodoInput } from '@/components/AddTodoInput';
import AppBar from '@/components/ui/appbar';
import { useNavigation } from '@react-navigation/native';
import { EmptyState } from '@/components/EmptyState';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useList } from '@/hooks/use-query-hooks';
import { RefreshControl, ScrollView } from 'react-native-gesture-handler';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants';
import { createNewTask, deleteList } from '@/controllers/list-actions';
import { notify } from '@/components/ui/toast-container';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

export default function ListDetailScreen() {
  const { id: listId } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);

  const { data: listRes } = useList(listId);
  const list = (listRes?.data || {}) as TodoList;

  const userRole =
    list.shared_with?.find((m) => m.id === currentUser?.id)?.role || 'viewer';

  const canEdit = userRole === 'owner' || userRole === 'contributor';

  const handleAddTodo = async (title: string) => {
    setIsLoading(true);
    const response = await createNewTask(listId, { task: title });

    if (response?.success) {
      notify({
        title: 'Success',
        message: `Task created successfully`,
        type: 'success',
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.USER_LISTS, listId],
      });
    } else {
      notify({
        title: 'Failed',
        message: `Failed to create a task`,
        type: 'error',
      });
    }

    setIsLoading(false);
  };

  const handleShareList = () => {
    router.push(`/lists/share/${list.id}`);
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    //  refetch data here
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.USER_LISTS, listId],
    });
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
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
          onPress: async () => {
            const r = await deleteList(listId);
            // TODO: ADD OPTIMISTIC UPDATES HERE
            if (r.success) {
              notify({
                title: 'Success',
                message: `Deleted list successfully`,
                type: 'success',
              });
              queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.USER_LISTS, listId],
              });
              router.back();
            } else {
              notify({
                title: 'Failed',
                message: `Failed to delete list`,
                type: 'error',
              });
            }
          },
        },
      ],
    );
  };

  const renderItem = ({ item }: { item: TodoItemType }) => (
    <TodoItem
      item={item}
      listId={list.id}
      canEdit={list.owner?.id === currentUser?.id}
      themeColor={list.color}
    />
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
        <Text style={styles.title}>{list.name}</Text>
        {list.description ? (
          <Text style={styles.description}>{list.description}</Text>
        ) : null}

        <View style={styles.meta}>
          <Text style={styles.metaText}>
            Created by {list.owner?.name || 'Unknown'}
          </Text>
          <Text style={styles.metaText}>
            {list.todo_items_count} item{list.todo_items_count !== 1 ? 's' : ''}
          </Text>
        </View>

        <View className="flex-row gap-2">
          <Button
            size="sm"
            style={{
              borderColor: list.color || colors.primary,
            }}
            variant="outline"
            className="py-0"
            onPress={() => {
              if (navigation.canGoBack()) {
                router.back();
              } else {
                router.replace('/(tabs)');
              }
            }}
          >
            <Undo2 size={16} color={list.color || colors.primary} />
          </Button>
          <Button
            style={{
              backgroundColor: list.color || colors.primary,
            }}
            onPress={handleShareList}
            leftIcon={<Share2 size={16} color={colors.white} />}
            className={cn('py-2')}
            size="sm"
          >
            Share
          </Button>
          {currentUser?.id === list.owner?.id && (
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

  if (!list) {
    return (
      <View className="flex flex-1 items-center justify-center">
        <EmptyState
          title="Oops! Not Found"
          message="Todo List with this ID was not found"
          buttonTitle="Go Back"
          onButtonPress={() => router.back()}
          icon={<ListPlusIcon size={64} color={colors.primary} />}
          buttonLeftIcon={<ArrowLeft size={20} color="#fff" />}
          classNames={{
            buttonWrapper: 'w-full',
            button: 'w-full items-center justify-center',
          }}
        />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background py-4">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        enabled
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20} // Adjust as needed
      >
        <View className="flex-1">
          <FlatList
            data={list.todo_items}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={renderListHeader}
            className="pb-8 gap-2"
            ListEmptyComponent={
              <View className="flex-1 h-full aspect-square items-center justify-center">
                <EmptyState
                  title="No Tasks"
                  message="Create your first todo item"
                  icon={<ClipboardList size={48} color={primary[500]} />}
                />
              </View>
            }
            showsVerticalScrollIndicator={false}
          />

          <View className="bg-card px-4 dark:bg-dark-background">
            <AddTodoInput
              isLoading={isLoading}
              onAdd={handleAddTodo}
              themeColor={list.color}
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
    backgroundColor: colors.background,
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
