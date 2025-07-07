import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import {
  ChevronRight,
  FolderOpen,
  ListCheckIcon,
  Users,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Group } from '@/types';

interface GroupCardProps {
  group: Group;
  onPress: () => void;
}

export const GroupCard: React.FC<GroupCardProps> = ({ group, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>
        <FolderOpen size={24} color={colors.primary} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {group.name}
        </Text>

        {group.description && (
          <Text style={styles.description} numberOfLines={1}>
            {group.description}
          </Text>
        )}

        <View style={styles.footer}>
          <View style={styles.stat}>
            <ListCheckIcon size={14} color={colors.textSecondary} />
            <Text style={styles.statText}>{group.todo_lists_count} lists</Text>
          </View>

          <View style={styles.stat}>
            <Users size={14} color={colors.textSecondary} />
            <Text style={styles.statText}>{group.members_count} members</Text>
          </View>
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
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
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
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
});
