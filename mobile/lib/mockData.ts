import { Group, TodoList, User } from '@/types';

export const currentUser: User = {
  id: 'user-1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
};

export const users: User[] = [
  currentUser,
  {
    id: 'user-2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 'user-3',
    name: 'Robert Johnson',
    email: 'robert@example.com',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 'user-4',
    name: 'Emily Davis',
    email: 'emily@example.com',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
];

export const todoLists: TodoList[] = [
  {
    id: 'list-1',
    title: 'Work Tasks',
    description: 'Important tasks for work',
    color: '#4A6FA5',
    items: [
      {
        id: 'item-1',
        title: 'Finish project proposal',
        completed: false,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        dueDate: new Date(Date.now() + 172800000).toISOString(),
      },
      {
        id: 'item-2',
        title: 'Schedule team meeting',
        completed: true,
        createdAt: new Date(Date.now() - 172800000).toISOString(),
      },
      {
        id: 'item-3',
        title: 'Review quarterly reports',
        completed: false,
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        dueDate: new Date(Date.now() + 86400000).toISOString(),
        notes: 'Focus on Q2 performance metrics',
      },
    ],
    createdAt: new Date(Date.now() - 604800000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    ownerId: currentUser.id,
    shared: [
      {
        userId: users[1].id,
        name: users[1].name,
        email: users[1].email,
        role: 'contributor',
      },
    ],
  },
  {
    id: 'list-2',
    title: 'Shopping List',
    color: '#F9C784',
    items: [
      {
        id: 'item-4',
        title: 'Groceries',
        completed: false,
        createdAt: new Date(Date.now() - 43200000).toISOString(),
      },
      {
        id: 'item-5',
        title: 'New headphones',
        completed: false,
        createdAt: new Date(Date.now() - 129600000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 432000000).toISOString(),
    updatedAt: new Date(Date.now() - 43200000).toISOString(),
    ownerId: currentUser.id,
    shared: [],
  },
  {
    id: 'list-3',
    title: 'Home Improvement',
    description: 'Projects around the house',
    color: '#95D5B2',
    items: [
      {
        id: 'item-6',
        title: 'Fix kitchen sink',
        completed: true,
        createdAt: new Date(Date.now() - 518400000).toISOString(),
      },
      {
        id: 'item-7',
        title: 'Paint living room',
        completed: false,
        createdAt: new Date(Date.now() - 432000000).toISOString(),
        dueDate: new Date(Date.now() + 1209600000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 1209600000).toISOString(),
    updatedAt: new Date(Date.now() - 432000000).toISOString(),
    ownerId: currentUser.id,
    shared: [
      {
        userId: users[2].id,
        name: users[2].name,
        email: users[2].email,
        role: 'viewer',
      },
    ],
  },
];

export const groups: Group[] = [
  {
    id: 'group-1',
    name: 'Work',
    description: 'Work-related projects and tasks',
    createdAt: new Date(Date.now() - 2592000000).toISOString(),
    ownerId: currentUser.id,
    lists: ['list-1'],
    members: [
      {
        userId: users[1].id,
        name: users[1].name,
        email: users[1].email,
        role: 'contributor',
      },
      {
        userId: users[3].id,
        name: users[3].name,
        email: users[3].email,
        role: 'viewer',
      },
    ],
  },
  {
    id: 'group-2',
    name: 'Personal',
    description: 'Personal projects and tasks',
    createdAt: new Date(Date.now() - 1728000000).toISOString(),
    ownerId: currentUser.id,
    lists: ['list-2', 'list-3'],
    members: [
      {
        userId: users[2].id,
        name: users[2].name,
        email: users[2].email,
        role: 'contributor',
      },
    ],
  },
];
