import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ListPlus, ClipboardList } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useTodoStore } from '@/store/todoStore';
import { TodoListCard } from '@/components/TodoListCard';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { EmptyState } from '@/components/EmptyState';
import { CreateListModal } from '@/components/CreateListModal';
import { TodoList } from '@/types';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/button';
import { useTodoLists } from '@/hooks/use-query-hooks';
import { createNewList } from '@/controllers/list-actions';
import { notify } from '@/components/ui/toast-container';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants';
import { Spinner } from '@/components/ui/spinner';
import { RefreshControl } from 'react-native-gesture-handler';

export default function ListsScreen() {
  const router = useRouter();
  const { data: listResponse, isLoading } = useTodoLists();
  const lists = (listResponse?.data?.todo_lists || []) as TodoList[];

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    //  refetch data here
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.USER_LISTS],
    });
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background py-4">
      <View className="flex-1">
        <FlatList
          data={lists}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TodoListCard
              list={item}
              onPress={() => {
                router.push(`/lists/${item.id}`);
              }}
            />
          )}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            lists.length !== 0 ? (
              <View className="pt-4 mb-4 gap-2">
                <Text className="text-2xl font-bold mb-2">My Lists</Text>
                <View className="flex-row w-full items-center justify-center">
                  <Button
                    className="w-full"
                    onPress={() => {
                      router.push('/lists/create');
                    }}
                    // onPress={() => setIsCreateModalVisible(true)}
                    leftIcon={<ListPlus size={20} color="#fff" />}
                  >
                    Create List
                  </Button>
                </View>
              </View>
            ) : null
          }
          ListEmptyComponent={
            isLoading ? (
              <Spinner size={80} loadingText="Initializing lists..." />
            ) : (
              <EmptyState
                title="No Lists Yet"
                message="Create your first todo list to get started"
                icon={<ClipboardList size={48} color={colors.primary} />}
                buttonTitle="Create New List"
                onButtonPress={() => setIsCreateModalVisible(true)}
                buttonLeftIcon={<ListPlus size={20} color="#fff" />}
                classNames={{
                  buttonWrapper: 'w-full',
                  button: 'w-full items-center justify-center',
                }}
              />
            )
          }
        />

        {lists.length !== 0 && (
          <FloatingActionButton onPress={() => setIsCreateModalVisible(true)} />
        )}

        <CreateListModal
          visible={isCreateModalVisible}
          onClose={() => setIsCreateModalVisible(false)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: colors.card,
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
