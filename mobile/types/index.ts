export type APIResponse = {
  success: boolean;
  message: string;
  data: unknown;
  status: number;
  [x: string]: unknown;
};

export type ErrorState = {
  status: boolean;
  message: string;
  type?: 'error' | 'success' | 'info' | 'warning';
  [x: string]: unknown;
};

export type Session = {
  user: Partial<User> | null;
  accessToken: string;
  role?: string;
  expiresAt?: Date;
  maxAge?: number;
  [x: string]: unknown;
};

export type User = {
  id?: string;
  name: string;
  role?: Role;
  imageUrl?: string;
  email?: string;
  [x: string]: unknown;
};

export type AuthFormData = User & {
  password: string;
  confirmPassword?: string;
};

export type passwordResetProps = {
  email?: string;
  otp?: string;
  currentPassword?: string;
  password: string;
  confirmPassword: string;
};

export type ResetPasswordFormProps = {
  formData: passwordResetProps;
  handleInputChange: (e: any, fields?: unknown) => void;
  updateFormData: (fields: { [key: string]: unknown }) => void;
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
  title: string;
  completed: boolean;
  createdAt: string;
  dueDate?: string;
  notes?: string;
};

export type TodoList = {
  id: string;
  title: string;
  description?: string;
  color?: string;
  items: TodoItem[];
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  shared: SharedUser[];
};

export type Role = 'owner' | 'contributor' | 'viewer';

export type SharedUser = {
  userId: string;
  name: string;
  email: string;
  role: Role;
};

export type Group = {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  ownerId: string;
  lists: string[]; // List IDs
  members: SharedUser[];
};
