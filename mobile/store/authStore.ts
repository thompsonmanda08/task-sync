import { create } from 'zustand';

import { deleteSession, verifySession } from '@/lib/session';
import { User } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;

  // SETTERS
  setUser: (user: User) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;

  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  userRole: null,
  isAuthenticated: false,

  // SETTERS
  setUser: (user: User) => set({ user }),
  setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),

  logout: async () => {
    await deleteSession();
    set({ user: null, isAuthenticated: false });
  },
}));

export async function InitializeUserSession() {
  const { session, isAuthenticated } = await verifySession();

  if (isAuthenticated) {
    useAuthStore.setState({
      user: (session?.user as unknown as User) || null,

      isAuthenticated,
    });
  }
  console.log('SESSION', session);
}
