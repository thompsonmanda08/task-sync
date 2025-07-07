import { create } from 'zustand';

import { deleteSession, verifySession } from '@/lib/session';
import { User } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserProfile } from '@/controllers/user-actions';
import { router } from 'expo-router';

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
    router.push('/(auth)');
  },
}));

export async function InitializeUserSession() {
  const { session, isAuthenticated } = await verifySession();

  if (isAuthenticated) {
    let user = session?.user || null;

    useAuthStore.setState({
      user: (user?.data as User) || null,
      isAuthenticated,
    });
  } else {
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
    });
  }
  console.log(
    isAuthenticated ? 'AUTHENTICATED-USER' : 'NO SESSION',
    session?.user,
  );
}
