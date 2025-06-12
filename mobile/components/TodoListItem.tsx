import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Check, Trash2 } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { TodoItem as TodoItemType } from '@/types';
import { useTodoStore } from '@/store/todoStore';
import { cn } from '@/lib/utils';

interface TodoItemProps {
  item: TodoItemType;
  listId: string;
  canEdit: boolean;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  item,
  listId,
  canEdit,
}) => {
  const { toggleTodoItem, deleteTodoItem } = useTodoStore();

  const handleToggle = () => {
    if (canEdit) {
      toggleTodoItem(listId, item.id);
    }
  };

  const handleDelete = () => {
    if (canEdit) {
      deleteTodoItem(listId, item.id);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.checkbox, item.completed && styles.checkboxCompleted]}
        // className={cn('bg-red-800 w-7 h-7 aspect-square rounded-full', {
        //   'bg-primary': item.completed,
        // })}
        onPress={handleToggle}
        disabled={!canEdit}
      >
        {item.completed && <Check size={18} color="#fff" />}
      </TouchableOpacity>
      <Text style={[styles.title, item.completed && styles.titleCompleted]}>
        {item.title}
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
