import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight, FolderOpen, Users } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Group } from '@/types';
import { useTodoStore } from '@/store/todoStore';

interface GroupItemProps {
  group: Group;
}

export const GroupItem: React.FC<GroupItemProps> = ({ group }) => {
  const router = useRouter();
  const { getListsInGroup } = useTodoStore();

  const lists = getListsInGroup(group.id);
  const memberCount = group.members.length;

  const navigateToGroup = () => {
    router.push(`/groups/${group.id}`);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={navigateToGroup}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <FolderOpen size={24} color={colors.primary} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{group.name}</Text>
        {group.description ? (
          <Text style={styles.description} numberOfLines={1}>
            {group.description}
          </Text>
        ) : null}
        <View style={styles.meta}>
          <Text style={styles.count}>
            {lists.length} list{lists.length !== 1 ? 's' : ''}
          </Text>
          {memberCount > 1 && (
            <View style={styles.members}>
              <Users size={14} color={colors.text} />
              <Text style={styles.memberCount}>{memberCount}</Text>
            </View>
          )}
        </View>
      </View>
      <ChevronRight size={20} color={colors.text} />
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
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: colors.placeholder,
    marginBottom: 8,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  count: {
    fontSize: 12,
    color: colors.placeholder,
  },
  members: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  memberCount: {
    fontSize: 12,
    color: colors.placeholder,
    marginLeft: 4,
  },
});
