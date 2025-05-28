// src/store/toastStore.ts
import { create } from "zustand";

type Toast = {
  id: number;
  message: string;
  type?: "success" | "error" | "info";
};

type ToastStore = {
  toasts: Toast[];
  showToast: (message: string, type?: Toast["type"]) => void;
  removeToast: (id: number) => void;
};

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  showToast: (message, type = "info") => {
    const id = Date.now();
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 3000);
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));
