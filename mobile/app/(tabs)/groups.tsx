import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { FolderPlus, Folders } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useTodoStore } from '@/store/todoStore';
import { GroupCard } from '@/components/GroupCard';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { EmptyState } from '@/components/EmptyState';
import { CreateGroupModal } from '@/components/CreateGroupModal';
import { Group } from '@/types';

export default function GroupsScreen() {
  const router = useRouter();
  const groups = useTodoStore((state) => state.groups);
  const addGroup = useTodoStore((state) => state.addGroup);

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  const handleCreateGroup = (
    groupData: Omit<
      Group,
      'id' | 'createdAt' | 'ownerId' | 'lists' | 'members'
    >,
  ) => {
    addGroup(groupData);
  };

  const navigateToGroup = (groupId: string) => {
    router.push(`/groups/${groupId}`);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GroupCard group={item} onPress={() => navigateToGroup(item.id)} />
        )}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>My Groups</Text>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title="No Groups Yet"
            message="Create a group to organize your todo lists"
            icon={<Folders size={48} color={colors.primary} />}
          />
        }
      />

      <FloatingActionButton onPress={() => setIsCreateModalVisible(true)} />

      <CreateGroupModal
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onSave={handleCreateGroup}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.card,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
    flexGrow: 1,
  },
});
