// src/features/auth/store/auth.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Profile } from '../../user/types/user.types';

type AuthState = {
  user: Profile | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean; // <-- ADD THIS
  setInitializing: (status: boolean) => void; 
  setUser: (user: Profile | null) => void;
  setToken: (token: string | null) => void;
  updateUserProfile: (updatedData: Partial<Profile>) => void;
  logout: () => void;
};

// ... (keep the bustCache helper function from the previous fix)
const bustCache = (profile: Profile | null): Profile | null => {
  if (profile && profile.image_url) {
    const baseUrl = profile.image_url.split('?')[0];
    return {
      ...profile,
      image_url: `${baseUrl}?v=${new Date().getTime()}`,
    };
  }
  return profile;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isInitializing: true, 
      setInitializing: (status) => set({ isInitializing: status }), 
      setUser: (user) => {
        const cacheBustedUser = bustCache(user);
        set({ user: cacheBustedUser, isAuthenticated: !!cacheBustedUser });
      },
      setToken: (token) => {
        set({ token });
      },
      updateUserProfile: (updatedData) => {
        set((state) => {
          if (!state.user) return {};
          const updatedUser = { ...state.user, ...updatedData };
          const cacheBustedUser = bustCache(updatedUser);
          return { user: cacheBustedUser };
        });
      },
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }),
    }
  )
);