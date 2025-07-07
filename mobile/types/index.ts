export type APIResponse = {
  success: boolean;
  message: string;
  data: any;
  status: number;
  [x: string]: unknown;
};

export type ErrorState = {
  status: boolean;
  message: string;
  type?: 'error' | 'success' | 'info' | 'warning';
  [x: string]: unknown;
};

export type User = {
  id?: string;
  name: string;
  profile_picture?: string;
  email: string;
  [x: string]: unknown;
};

export type RegistrationFormData = {
  name: string;
  email: string;
  password: string;
};

export type AuthFormData = {
  password: string;
  email: string;
};

export type OptionItem = {
  id: string | number;
  name: string;
  label?: string;
  value?: string;
  [x: string]: unknown;
};

export type TodoItem = {
  id: string;
  task: string;
  description?: string;
  is_completed: boolean;
  created_at: string;
  start_date?: string;
  end_date?: string;
  priority?: string;
};

export type TodoList = {
  id: string;
  name: string;
  description?: string;
  color: string;
  todo_items?: TodoItem[];
  todo_items_count?: number;
  completed_count?: number;
  created_at: string;
  updated_at: string;
  created_by: string;
  owner_id?: string;
  owner: SharedUser;
  group_id?: string;
  shared_with?: SharedUser[];
  shared_with_count?: number;
};

export type Role = 'owner' | 'contributor' | 'viewer';

export type SharedUser = {
  id: string;
  name: string;
  email: string;
  role?: Role;
};

export type Group = {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  owner: SharedUser;
  lists?: TodoList[];
  members?: SharedUser[];
  members_count: number;
  lists_count: number;
};
