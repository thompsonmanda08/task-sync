import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Check, Trash2 } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { TodoItem as TodoItemType } from '@/types';
import { useTodoStore } from '@/store/todoStore';
import { cn } from '@/lib/utils';
import {
  deleteList,
  deleteListItem,
  updateTaskItem,
} from '@/controllers/list-actions';
import { router } from 'expo-router';
import { notify } from './ui/toast-container';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants';

interface TodoItemProps {
  item: TodoItemType;
  listId: string;
  canEdit: boolean;
  themeColor: string;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  item,
  listId,
  canEdit,
  themeColor,
}) => {
  const { toggleTodoComplete, deleteTodoItem } = useTodoStore();
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleToggle = async () => {
    if (canEdit) {
      toggleTodoComplete(listId, item.id);
      const r = await updateTaskItem(listId, item?.id, {
        is_completed: !item?.is_completed,
      });

      // TODO: ADD OPTIMISTIC UPDATES HERE
      if (r.success) {
        notify({
          title: 'Success',
          message: item?.is_completed
            ? 'Ohh ohh still working on it'
            : `Awesome, you did it!`,
          type: 'success',
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.USER_LISTS, listId],
        });
      } else {
        notify({
          title: 'Failed',
          message: `Oops! Looks like an error!`,
          type: 'error',
        });
      }
    }
  };

  const handleDelete = () => {
    if (canEdit) {
      Alert.alert(
        'Delete List',
        'Are you sure you want to delete this task? This action cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              const r = await deleteListItem(listId, item?.id);
              // TODO: ADD OPTIMISTIC UPDATES HERE
              if (r.success) {
                notify({
                  title: 'Success',
                  message: `Deleted task successfully`,
                  type: 'success',
                });
                queryClient.invalidateQueries({
                  queryKey: [QUERY_KEYS.USER_LISTS, listId],
                });
              } else {
                notify({
                  title: 'Failed',
                  message: `Failed to delete task`,
                  type: 'error',
                });
              }
            },
          },
        ],
      );
    }
  };

  return (
    <View style={styles.container} className="mb-3">
      <TouchableOpacity
        style={[
          {
            width: 28,
            height: 28,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: themeColor || colors.primary,
            marginRight: 12,
            marginLeft: 8,
            alignItems: 'center',
            justifyContent: 'center',
          },
          item.is_completed && {
            backgroundColor: themeColor || colors.primary,
            borderColor: colors.primary,
          },
        ]}
        // className={cn('bg-red-800 w-7 h-7 aspect-square rounded-full', {
        //   'bg-primary': item.completed,
        // })}
        onPress={handleToggle}
        disabled={!canEdit}
      >
        {item.is_completed && <Check size={18} color="#fff" />}
      </TouchableOpacity>
      <Text style={[styles.title, item.is_completed && styles.titleCompleted]}>
        {item.task}
      </Text>
      {canEdit && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <Trash2 size={18} color={colors.danger} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    // borderBottomWidth: 1,
    // borderBottomColor: colors.border,
    backgroundColor: 'white',
    borderRadius: 12,
    marginInline: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    marginRight: 12,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCompleted: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  title: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.placeholder,
  },
  deleteButton: {
    padding: 4,
  },
});
