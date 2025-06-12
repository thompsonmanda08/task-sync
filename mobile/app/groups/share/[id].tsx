import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTodoStore } from '@/store/todoStore';
import { UserItem } from '@/components/UserItem';
import { RoleSelector } from '@/components/RoleSelector';
import { colors } from '@/constants/colors';
import { Role, User } from '@/types';
import { Button } from '@/components/ui/button';

interface MemberWithUser {
  user: User | undefined;
  role: Role;
}

export default function ShareGroupScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const {
    getGroupById,
    users,
    currentUser,
    addToGroup,
    updateGroupMemberRole,
    removeFromGroup,
  } = useTodoStore();

  const group = getGroupById(id);

  if (!group) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Group not found</Text>
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }

  const userRole = group.members.find((m) => m.userId === currentUser.id)?.role;
  const isOwner = userRole === 'owner';

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role>('viewer');

  const nonMemberUsers = users.filter(
    (user) =>
      user.id !== currentUser.id &&
      !group.members.some((member) => member.userId === user.id),
  );

  const memberUsers = group.members
    .filter((member) => member.userId !== currentUser.id)
    .map((member) => {
      const user = users.find((u) => u.id === member.userId);
      return { user, role: member.role };
    })
    .filter((item) => item.user) as MemberWithUser[];

  const handleShare = () => {
    if (selectedUserId) {
      addToGroup(group.id, selectedUserId, selectedRole);
      setSelectedUserId(null);
    }
  };

  const handleUpdateRole = (userId: string, role: Role) => {
    updateGroupMemberRole(group.id, userId, role);
  };

  const handleRemoveMember = (userId: string) => {
    removeFromGroup(group.id, userId);
  };

  const renderNonMemberItem = ({ item }: { item: User }) => (
    <UserItem
      user={item}
      onPress={() =>
        setSelectedUserId(selectedUserId === item.id ? null : item.id)
      }
      selectable
      selected={selectedUserId === item.id}
    />
  );

  const renderMemberItem = ({ item }: { item: MemberWithUser }) => (
    <View style={styles.memberItem}>
      <UserItem user={item.user} role={item.role} />
      {isOwner && (
        <View style={styles.memberActions}>
          <RoleSelector
            selectedRole={item.role}
            onChange={(role) => handleUpdateRole(String(item.user!.id), role)}
          />
          <Button
            onPress={() => handleRemoveMember(String(item.user!.id))}
            variant="destructive"
            size="sm"
          >
            Remove
          </Button>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Share "{group.name}" with others</Text>

      {memberUsers.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Members</Text>
          <FlatList
            data={memberUsers}
            renderItem={renderMemberItem}
            keyExtractor={(item) => item.user!.id}
            scrollEnabled={false}
          />
        </View>
      )}

      {isOwner && (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Add New Members</Text>
            <FlatList
              data={nonMemberUsers}
              renderItem={renderNonMemberItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>

          {selectedUserId && (
            <View style={styles.roleSection}>
              <RoleSelector
                selectedRole={selectedRole}
                onChange={setSelectedRole}
              />

              <Button title="Share Group" onPress={handleShare} fullWidth />
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 12,
  },
  memberItem: {
    marginBottom: 16,
  },
  memberActions: {
    marginTop: 8,
    marginLeft: 52,
  },
  roleSection: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  errorText: {
    fontSize: 18,
    color: colors.danger,
    marginBottom: 16,
    textAlign: 'center',
  },
});
