import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import {
  todoLists as mockTodoLists,
  groups as mockGroups,
  currentUser as mockCurrentUser,
  users as mockUsers,
} from '@/lib/mockData';
import { Group, Role, SharedUser, TodoItem, TodoList, User } from '@/types';

interface TodoState {
  lists: TodoList[];
  groups: Group[];
  currentUser: User;
  users: User[];

  // List actions
  addList: (
    list: Omit<
      TodoList,
      | 'id'
      | 'created_at'
      | 'updated_at'
      | 'owner_id'
      | 'shared_with'
      | 'todo_items'
    >,
  ) => void;
  updateList: (listId: string, updates: Partial<TodoList>) => void;
  deleteList: (listId: string) => void;

  // Todo item actions
  addTodoItem: (
    listId: string,
    item: Omit<TodoItem, 'id' | 'createdAt'>,
  ) => void;
  updateTodoItem: (
    listId: string,
    itemId: string,
    updates: Partial<TodoItem>,
  ) => void;
  deleteTodoItem: (listId: string, itemId: string) => void;
  toggleTodoComplete: (listId: string, itemId: string) => void;

  // Sharing actions
  shareList: (listId: string, userId: string, role: Role) => void;
  updateSharedUserRole: (listId: string, userId: string, role: Role) => void;
  removeSharedUser: (listId: string, userId: string) => void;

  // Group actions
  addGroup: (group: Omit<Group, 'id' | 'createdAt' | 'ownerId'>) => void;
  updateGroup: (groupId: string, updates: Partial<Group>) => void;
  deleteGroup: (groupId: string) => void;
  addListToGroup: (groupId: string, listId: string) => void;
  removeListFromGroup: (groupId: string, listId: string) => void;
  addUserToGroup: (groupId: string, userId: string, role: Role) => void;
  updateGroupUserRole: (groupId: string, userId: string, role: Role) => void;
  removeUserFromGroup: (groupId: string, userId: string) => void;

  // Getters
  // getListsInGroup: (groupId: string) => TodoList[];
  getListById: (listId: string) => TodoList | undefined;
  // getGroupById: (groupId: string) => Group | undefined;
  getUserById: (userId: string) => User | undefined;
  // getListsByUser: (userId: string) => TodoList[];
  // getGroupsByUser: (userId: string) => Group[];
}

export const useTodoStore = create<TodoState>()(
  persist(
    (set, get) => ({
      lists: mockTodoLists,
      groups: mockGroups,
      currentUser: mockCurrentUser,
      users: mockUsers,

      // List actions
      addList: (list) =>
        set((state) => {
          const newList: TodoList = {
            ...list,
            id: `list-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ownerId: String(state.currentUser.id),
            shared: [],
            items: list.items || [],
          };
          return { lists: [...state.lists, newList] };
        }),

      updateList: (listId, updates) =>
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === listId
              ? { ...list, ...updates, updatedAt: new Date().toISOString() }
              : list,
          ),
        })),

      deleteList: (listId) =>
        set((state) => ({
          lists: state.lists.filter((list) => list.id !== listId),
          groups: state.groups.map((group) => ({
            ...group,
            lists: group.lists.filter((id) => id !== listId),
          })),
        })),

      // Todo item actions
      addTodoItem: (listId, item) =>
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === listId
              ? {
                  ...list,
                  items: [
                    ...list.items,
                    {
                      ...item,
                      id: `item-${Date.now()}`,
                      createdAt: new Date().toISOString(),
                      completed: item.completed || false,
                    },
                  ],
                  updatedAt: new Date().toISOString(),
                }
              : list,
          ),
        })),

      updateTodoItem: (listId, itemId, updates) =>
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === listId
              ? {
                  ...list,
                  items: list.items.map((item) =>
                    item.id === itemId ? { ...item, ...updates } : item,
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : list,
          ),
        })),

      deleteTodoItem: (listId, itemId) =>
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === listId
              ? {
                  ...list,
                  items: list.items.filter((item) => item.id !== itemId),
                  updatedAt: new Date().toISOString(),
                }
              : list,
          ),
        })),

      toggleTodoComplete: (listId, itemId) =>
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === listId
              ? {
                  ...list,
                  items: list.items.map((item) =>
                    item.id === itemId
                      ? { ...item, completed: !item.completed }
                      : item,
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : list,
          ),
        })),

      // Sharing actions
      shareList: (listId, userId, role) =>
        set((state) => {
          const user = state.users.find((u) => u.id === userId);
          if (!user) return state;

          const sharedUser: SharedUser = {
            userId: String(user.id),
            name: String(user.name),
            email: String(user.email),
            role,
          };

          return {
            lists: state.lists.map((list) =>
              list.id === listId
                ? {
                    ...list,
                    shared: [
                      ...list.shared.filter((s) => s.userId !== userId),
                      sharedUser,
                    ],
                    updatedAt: new Date().toISOString(),
                  }
                : list,
            ),
          };
        }),

      updateSharedUserRole: (listId, userId, role) =>
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === listId
              ? {
                  ...list,
                  shared: list.shared.map((user) =>
                    user.userId === userId ? { ...user, role } : user,
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : list,
          ),
        })),

      removeSharedUser: (listId, userId) =>
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === listId
              ? {
                  ...list,
                  shared: list.shared.filter((user) => user.userId !== userId),
                  updatedAt: new Date().toISOString(),
                }
              : list,
          ),
        })),

      // Group actions
      addGroup: (group) =>
        set((state) => {
          const newGroup: Group = {
            ...group,
            id: `group-${Date.now()}`,
            createdAt: new Date().toISOString(),
            ownerId: String(state.currentUser.id),
            lists: group.lists || [],
            members: group.members || [],
          };
          return { groups: [...state.groups, newGroup] };
        }),

      updateGroup: (groupId, updates) =>
        set((state) => ({
          groups: state.groups.map((group) =>
            group.id === groupId ? { ...group, ...updates } : group,
          ),
        })),

      deleteGroup: (groupId) =>
        set((state) => ({
          groups: state.groups.filter((group) => group.id !== groupId),
        })),

      addListToGroup: (groupId, listId) =>
        set((state) => ({
          groups: state.groups.map((group) =>
            group.id === groupId && !group.lists.includes(listId)
              ? { ...group, lists: [...group.lists, listId] }
              : group,
          ),
        })),

      removeListFromGroup: (groupId, listId) =>
        set((state) => ({
          groups: state.groups.map((group) =>
            group.id === groupId
              ? { ...group, lists: group.lists.filter((id) => id !== listId) }
              : group,
          ),
        })),

      addUserToGroup: (groupId, userId, role) =>
        set((state) => {
          const user = state.users.find((u) => u.id === userId);
          if (!user) return state;

          const sharedUser: SharedUser = {
            userId: String(user.id),
            name: String(user.name),
            email: String(user.email),
            role,
          };

          return {
            groups: state.groups.map((group) =>
              group.id === groupId
                ? {
                    ...group,
                    members: [
                      ...group.members.filter((m) => m.userId !== userId),
                      sharedUser,
                    ],
                  }
                : group,
            ),
          };
        }),

      updateGroupUserRole: (groupId, userId, role) =>
        set((state) => ({
          groups: state.groups.map((group) =>
            group.id === groupId
              ? {
                  ...group,
                  members: group.members.map((member) =>
                    member.userId === userId ? { ...member, role } : member,
                  ),
                }
              : group,
          ),
        })),

      removeUserFromGroup: (groupId, userId) =>
        set((state) => ({
          groups: state.groups.map((group) =>
            group.id === groupId
              ? {
                  ...group,
                  members: group.members.filter(
                    (member) => member.userId !== userId,
                  ),
                }
              : group,
          ),
        })),

      getUserById: (userId) => {
        return get().users.find((user) => user.id === userId);
      },

      getListById: (listId) => {
        return get().lists.find((list) => list.id === listId);
      },
    }),
    {
      name: 'todo-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
