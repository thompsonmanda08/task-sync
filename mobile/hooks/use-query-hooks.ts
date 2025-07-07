import { QUERY_KEYS } from '@/constants';
import {
  getGroup,
  getUserGroupRoles,
  getUserGroups,
} from '@/controllers/group-actions';
import { getList, getUserLists } from '@/controllers/list-actions';
import { getUserProfile } from '@/controllers/user-actions';
import { useQuery } from '@tanstack/react-query';

export function useUserProfile() {
  return useQuery({
    queryKey: [QUERY_KEYS.PROFILE],
    refetchOnMount: true,
    queryFn: getUserProfile,
    staleTime: Infinity,
  });
}
export function useTodoLists() {
  return useQuery({
    queryKey: [QUERY_KEYS.USER_LISTS],
    queryFn: getUserLists,
    refetchOnMount: true,
    staleTime: Infinity,
  });
}

export function useList(listId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.USER_LISTS, listId],
    queryFn: async () => getList(listId),
    refetchOnMount: true,
    staleTime: 3 * 60 * 1000, // 10 minutes
  });
}

export function useGroups() {
  return useQuery({
    queryKey: [QUERY_KEYS.GROUPS],
    queryFn: getUserGroups,
    refetchOnMount: true,
    staleTime: Infinity,
  });
}

export function useGroup(groupId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.GROUPS, groupId],
    queryFn: async () => getGroup(groupId),
    refetchOnMount: true,
    staleTime: Infinity,
  });
}

export function useGroupRoles() {
  return useQuery({
    queryKey: ['roles'],
    queryFn: getUserGroupRoles,
    staleTime: Infinity,
  });
}
