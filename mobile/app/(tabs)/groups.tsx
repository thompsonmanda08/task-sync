import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { FolderPlus, Folders, UserPlus2Icon } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useTodoStore } from '@/store/todoStore';
import { GroupCard } from '@/components/GroupCard';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { EmptyState } from '@/components/EmptyState';
import { CreateGroupModal } from '@/components/CreateGroupModal';
import { Group } from '@/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGroups } from '@/hooks/use-query-hooks';
import { Spinner } from '@/components/ui/spinner';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants';
import { RefreshControl } from 'react-native-gesture-handler';

export default function GroupsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: groupsResponse, isLoading } = useGroups();
  const groups = (groupsResponse?.data || []) as Group[];

  const [isRefreshing, setIsRefreshing] = useState(false);

  async function onRefresh() {
    setIsRefreshing(true);

    await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GROUP_LISTS] });

    setTimeout(() => {
      setIsRefreshing(false);
    }, 3000);
  }

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  const navigateToGroup = (groupId: string) => {
    router.push(`/groups/${groupId}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background py-4">
      <View className="flex-1">
        <FlatList
          data={groups}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <GroupCard group={item} onPress={() => navigateToGroup(item.id)} />
          )}
          className="p-4 pt-2 flex-grow"
          ListHeaderComponent={
            groups.length !== 0 ? (
              <View className="px-2 py-3">
                <Text className="text-2xl font-bold text-foreground dark:text-dark-foreground mb-2">
                  My Groups
                </Text>
              </View>
            ) : null
          }
          ListEmptyComponent={
            isLoading ? (
              <Spinner size={80} loadingText="Initializing groups..." />
            ) : (
              <EmptyState
                title="No Groups Yet"
                message="Create a group to organize your todo lists"
                icon={<Folders size={48} color={colors.primary} />}
                buttonTitle="Create New Group"
                onButtonPress={() => setIsCreateModalVisible(true)}
                buttonLeftIcon={<UserPlus2Icon size={20} color="#fff" />}
                classNames={{
                  buttonWrapper: 'w-full',
                  button: 'w-full items-center justify-center',
                }}
              />
            )
          }
        />

        {groups.length !== 0 && (
          <FloatingActionButton onPress={() => setIsCreateModalVisible(true)} />
        )}

        <CreateGroupModal
          visible={isCreateModalVisible}
          onClose={() => setIsCreateModalVisible(false)}
        />
      </View>
    </SafeAreaView>
  );
}
