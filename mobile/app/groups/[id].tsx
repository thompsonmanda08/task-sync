import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Plus, Share2, Users, Trash2, FolderPlus } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { EmptyState } from '@/components/EmptyState';
import { ShareModal } from '@/components/ShareModal';
import { TodoListCard } from '@/components/TodoListCard';
import { UserListItem } from '@/components/UserListItem';
import { colors } from '@/constants/colors';
import { useTodoStore } from '@/store/todoStore';
import { Role } from '@/types';

export default function GroupScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const group = useTodoStore((state) => state.groups.find((g) => g.id === id));
  const lists = useTodoStore((state) =>
    state.lists.filter((list) => group?.lists.includes(list.id)),
  );
  const allLists = useTodoStore((state) => state.lists);
  const users = useTodoStore((state) => state.users);
  const currentUser = useTodoStore((state) => state.currentUser);

  const deleteGroup = useTodoStore((state) => state.deleteGroup);
  const addUserToGroup = useTodoStore((state) => state.addUserToGroup);

  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const [isShowingMembers, setIsShowingMembers] = useState(false);

  if (!group) {
    return (
      <EmptyState
        title="Group Not Found"
        message="The group you're looking for doesn't exist"
      />
    );
  }

  const handleDeleteGroup = () => {
    Alert.alert(
      'Delete Group',
      'Are you sure you want to delete this group? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteGroup(group.id);
            router.back();
          },
        },
      ],
    );
  };

  const handleShareGroup = (userId: string, role: Role) => {
    addUserToGroup(group.id, userId, role);
    setIsShareModalVisible(false);
  };

  const navigateToList = (listId: string) => {
    router.push(`/lists/${listId}`);
  };

  const isOwner = group.ownerId === currentUser.id;
  const alreadySharedUserIds = [
    currentUser.id,
    ...group.members.map((member) => member.userId),
  ];

  return (
    <>
      <Stack.Screen
        options={{
          title: group.name,
          headerRight: () => (
            <View style={styles.headerButtons}>
              {isOwner && (
                <TouchableOpacity
                  style={styles.headerButton}
                  onPress={() => setIsShareModalVisible(true)}
                >
                  <Share2 size={20} color={colors.text} />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => setIsShowingMembers(!isShowingMembers)}
              >
                <Users size={20} color={colors.text} />
              </TouchableOpacity>

              {isOwner && (
                <TouchableOpacity
                  style={styles.headerButton}
                  onPress={handleDeleteGroup}
                >
                  <Trash2 size={20} color={colors.danger} />
                </TouchableOpacity>
              )}
            </View>
          ),
        }}
      />

      <View style={styles.container}>
        {isShowingMembers ? (
          <View style={styles.membersContainer}>
            <View style={styles.membersHeader}>
              <Text style={styles.membersTitle}>Group Members</Text>
              <TouchableOpacity onPress={() => setIsShowingMembers(false)}>
                <Text style={styles.backButton}>Back to Lists</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.ownerContainer}>
              <Text style={styles.sectionLabel}>Owner</Text>
              <UserListItem
                user={{
                  userId: String(currentUser.id),
                  name: String(currentUser.name),
                  email: String(currentUser.email),
                  role: 'owner',
                }}
              />
            </View>

            {group.members.length > 0 && (
              <View style={styles.membersListContainer}>
                <Text style={styles.sectionLabel}>Members</Text>
                {group.members.map((member) => (
                  <UserListItem
                    key={member.userId}
                    user={member}
                    onOptionsPress={isOwner ? () => {} : undefined}
                  />
                ))}
              </View>
            )}
          </View>
        ) : (
          <>
            <FlatList
              data={lists}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TodoListCard
                  list={item}
                  onPress={() => navigateToList(item.id)}
                />
              )}
              contentContainerStyle={styles.listContent}
              ListHeaderComponent={
                <View style={styles.header}>
                  {group.description && (
                    <Text style={styles.description}>{group.description}</Text>
                  )}
                </View>
              }
              ListEmptyComponent={
                <EmptyState
                  title="No Lists Yet"
                  message="Add todo lists to this group"
                  icon={<FolderPlus size={48} color={colors.primary} />}
                />
              }
            />

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                // This would open a modal to add existing lists to the group
                // For simplicity, we're not implementing this fully
                Alert.alert(
                  'Add Lists',
                  'This would show a modal to add existing lists to this group.',
                );
              }}
            >
              <Plus size={20} color="#fff" />
              <Text style={styles.addButtonText}>Add List to Group</Text>
            </TouchableOpacity>
          </>
        )}

        <ShareModal
          visible={isShareModalVisible}
          onClose={() => setIsShareModalVisible(false)}
          onShare={handleShareGroup}
          users={users}
          alreadySharedUserIds={alreadySharedUserIds as string[]}
          title={`Invite to "${group.name}"`}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.card,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
    flexGrow: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    margin: 16,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  membersContainer: {
    flex: 1,
    padding: 16,
  },
  membersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  membersTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  backButton: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
    marginTop: 16,
  },
  ownerContainer: {
    marginBottom: 16,
  },
  membersListContainer: {
    flex: 1,
  },
});
