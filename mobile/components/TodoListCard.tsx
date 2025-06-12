import { ChevronRight, Users } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import { colors } from '@/constants/colors';
import { TodoList } from '@/types';

interface TodoListCardProps {
  list: TodoList;
  onPress: () => void;
}

export const TodoListCard: React.FC<TodoListCardProps> = ({
  list,
  onPress,
}) => {
  const completedCount = list.items.filter((item) => item.completed).length;
  const totalCount = list.items.length;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View
        style={[
          styles.colorIndicator,
          { backgroundColor: list.color || colors.primary },
        ]}
      />

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {list.title}
        </Text>

        {list.description && (
          <Text style={styles.description} numberOfLines={1}>
            {list.description}
          </Text>
        )}

        <View style={styles.footer}>
          <Text style={styles.count}>
            {completedCount}/{totalCount} completed
          </Text>

          {list.shared.length > 0 && (
            <View style={styles.sharedIndicator}>
              <Users size={14} color={colors.textSecondary} />
              <Text style={styles.sharedText}>{list.shared.length}</Text>
            </View>
          )}
        </View>
      </View>

      <ChevronRight size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  colorIndicator: {
    width: 4,
    height: '80%',
    borderRadius: 2,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  count: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  sharedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  sharedText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
});
