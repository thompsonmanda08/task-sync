import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
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

export default function ListsScreen() {
  const router = useRouter();
  const lists = useTodoStore((state) => state.lists);
  const addList = useTodoStore((state) => state.addList);

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  const handleCreateList = (
    listData: Omit<
      TodoList,
      'id' | 'createdAt' | 'updatedAt' | 'owner_id' | 'shared' | 'items'
    >,
  ) => {
    addList(listData);
  };

  const navigateToList = (listId: string) => {
    router.push(`/lists/${listId}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background">
      <View className="flex-1">
        <FlatList
          data={lists}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TodoListCard list={item} onPress={() => navigateToList(item.id)} />
          )}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View className="px-2 py-4 mb-2">
              <Text className="text-4xl font-bold">My Lists</Text>
            </View>
          }
          ListEmptyComponent={
            <EmptyState
              title="No Lists Yet"
              message="Create your first todo list to get started"
              icon={<ClipboardList size={48} color={colors.primary} />}
            />
          }
        />

        <FloatingActionButton onPress={() => setIsCreateModalVisible(true)} />

        <CreateListModal
          visible={isCreateModalVisible}
          onClose={() => setIsCreateModalVisible(false)}
          onSave={handleCreateList}
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
