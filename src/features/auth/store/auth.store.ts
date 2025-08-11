// src/features/auth/store/auth.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../../user/types/user.types';

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null, token: string | null) => void;
  setToken: (token: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setUser: (user, token) => {
        set({ user, token, isAuthenticated: !!user });
      },
      setToken: (token) => {
        set({ token });
      },
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);