import React, { useCallback } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { ListPlus, ClipboardList } from 'lucide-react-native';
import { useTodoStore } from '@/store/todoStore';
import { ListItem } from '@/components/ListItem';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { colors } from '@/constants/colors';

export default function ListsScreen() {
  const router = useRouter();
  const { todoLists, currentUser, getListsByUser } = useTodoStore();

  const userLists = getListsByUser(currentUser.id);

  useFocusEffect(
    useCallback(() => {
      // Refresh data when screen is focused
      // This is a placeholder for when we'd fetch from an API
    }, []),
  );

  const navigateToCreateList = () => {
    router.push('/lists/create');
  };

  const renderItem = ({ item }) => <ListItem list={item} />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button
          title="Create List"
          onPress={navigateToCreateList}
          icon={<ListPlus size={20} color="#fff" />}
        />
      </View>

      {userLists.length === 0 ? (
        <EmptyState
          title="No Lists Yet"
          description="Create your first todo list to get started."
          buttonTitle="Create List"
          onButtonPress={navigateToCreateList}
          icon={<ClipboardList size={64} color={colors.primary} />}
        />
      ) : (
        <FlatList
          data={userLists}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
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
  header: {
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
});
