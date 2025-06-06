// src/stores/toastStore.js
import { create } from 'zustand';

export const useToastStore = create((set) => ({
  toasts: [],
  addToast: ({ message, type = 'info' }) =>
    set((state) => {
      const id = Date.now();
      return { toasts: [...state.toasts, { id, message, type }] };
    }),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));
