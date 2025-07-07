import React, { useCallback } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  FolderPlus,
  ListPlus,
  Share2,
  Trash2,
  Undo2Icon,
} from 'lucide-react-native';
import { useTodoStore } from '@/store/todoStore';
import { EmptyState } from '@/components/EmptyState';
import { colors } from '@/constants/colors';
import { Group, TodoList } from '@/types';
import { Button } from '@/components/ui/button';
import { TodoListCard } from '@/components/TodoListCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGroup } from '@/hooks/use-query-hooks';
import { useNavigation } from '@react-navigation/native';
import { Spinner } from '@/components/ui/spinner';
import { QUERY_KEYS } from '@/constants';
import { useAuthStore } from '@/store/authStore';
import { deleteGroup } from '@/controllers/group-actions';
import { notify } from '@/components/ui/toast-container';
import { useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

export default function GroupDetailScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { id: groupId } = useLocalSearchParams<{ id: string }>();

  const { user: currentUser } = useAuthStore();

  const { data: groupResponse, isLoading } = useGroup(groupId);
  const group = (groupResponse?.data || {}) as Group;

  const lists = group?.lists || [];

  console.log('DATA FROM ID: ', group);

  const userRole =
    group?.members?.find((m) => m.id === currentUser?.id)?.role || 'viewer';
  const canEdit = userRole === 'owner' || userRole === 'contributor';

  const handleShareGroup = () => {
    router.push(`/groups/share/${groupId}`);
  };

  const handleDeleteGroup = useCallback(() => {
    Alert.alert(
      'Delete Group',
      'Are you sure you want to delete this group? Lists in this group will not be deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            // TODO: ADD OPTIMISTIC UPDATES HERE
            const r = await deleteGroup(groupId);
            if (r.success) {
              notify({
                title: 'Success',
                message: `Deleted group successfully`,
                type: 'success',
              });
              queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GROUPS],
              });
              router.back();
            } else {
              notify({
                title: 'Failed',
                message: `Failed to delete group`,
                type: 'error',
              });
            }
          },
        },
      ],
    );
  }, []);

  const handleCreateList = useCallback(() => {
    router.push({
      pathname: '/lists/create',
      params: { groupId: group.id },
    });
  }, []);

  if (!group?.id) {
    return (
      <View className="flex flex-1 items-center justify-center">
        <EmptyState
          title="Oops! Not Found"
          message="Group with this ID was not found"
          buttonTitle="Go Back"
          onButtonPress={() => router.back()}
          icon={<FolderPlus size={64} color={colors.primary} />}
        />
      </View>
    );
  }

  const renderItem = ({ item }: { item: TodoList }) => (
    <TodoListCard
      list={item}
      onPress={() => {
        console.log('GO TO LIST');
        router.push(`/lists/${item?.id}`);
      }}
    />
  );

  const renderGroupHeader = () => (
    <View className="p-4 border-b border-gray-200">
      <View className="flex-1">
        <Text
          style={styles.title}
          className="text-xl font-bold mb-2 text-foreground dark:text-dark-foreground"
        >
          {group.name || 'Group Details'}
        </Text>
        {group.description ? (
          <Text className="text-base text-gray-500 mb-4">
            {group.description}
          </Text>
        ) : null}

        <View className="mb-4">
          <Text className="text-md text-gray-500 mb-1">
            Created by {group.owner?.name || 'Unknown'}
          </Text>
          <Text className="text-md text-gray-500 mb-1">
            {lists.length} list{lists.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <View className="flex-row gap-2">
          <Button
            size="sm"
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
            <Undo2Icon size={16} color={colors.primary} />
          </Button>
          <Button
            onPress={handleCreateList}
            leftIcon={<FolderPlus size={16} color="#fff" />}
            size="sm"
            disabled={!canEdit}
          >
            Add List
          </Button>
          <Button
            onPress={handleShareGroup}
            leftIcon={<Share2 size={16} color={colors.white} />}
            className="py-2"
            size="sm"
          >
            Share
          </Button>
          {userRole === 'owner' && (
            <Button
              onPress={handleDeleteGroup}
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

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background py-4">
      <View
        className={cn('flex-1', {
          'items-center justify-center h-full': isLoading,
        })}
      >
        <FlatList
          // data={lists}
          data={[]}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderGroupHeader}
          className="px-4 flex-1"
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            isLoading ? (
              <>
                <Spinner size={80} loadingText="Initializing..." />
              </>
            ) : (
              <View className="flex-1 h-full py-24">
                <EmptyState
                  title="No Lists Yet"
                  message="Add your first list to this group."
                  icon={<FolderPlus size={64} color={colors.primary} />}
                  buttonTitle="Create New List"
                  onButtonPress={handleCreateList}
                  buttonLeftIcon={<ListPlus size={20} color="#fff" />}
                  classNames={{
                    buttonWrapper: 'w-full',
                    button: 'w-full items-center justify-center',
                  }}
                />
              </View>
            )
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
  actionButton: {
    marginLeft: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  errorText: {
    fontSize: 18,
    color: colors.danger,
    marginBottom: 16,
    textAlign: 'center',
  },
});
