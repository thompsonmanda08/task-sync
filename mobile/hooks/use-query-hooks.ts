import { TodoList } from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useCargoListings() {
  let lists: TodoList[] = [];

  // In a real app, this would be an API call
  const fetchListings = async (): Promise<TodoList[]> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return lists;
  };

  return useQuery({
    queryKey: ['todo-lists', lists.length],
    queryFn: fetchListings,
    staleTime: 3 * 60 * 1000, // 10 minutes
  });
}
