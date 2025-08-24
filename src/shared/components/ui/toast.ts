// src/shared/components/ui/toast.ts
import { create } from 'zustand';

export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastState {
  toasts: ToastMessage[];
  addToast: (message: string, variant: ToastVariant) => void;
  dismissToast: (id: number) => void;
}

const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (message, variant) => {
    set((state) => ({
      toasts: [...state.toasts, { id: Date.now(), message, variant }],
    }));
  },
  dismissToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
}));

// The public API for our toast system
export const toast = {
  success: (message: string) => useToastStore.getState().addToast(message, 'success'),
  error: (message: string) => useToastStore.getState().addToast(message, 'error'),
  info: (message: string) => useToastStore.getState().addToast(message, 'info'),
};

export default useToastStore;