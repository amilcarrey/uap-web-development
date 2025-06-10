import { create } from "zustand";

type ToastType = "success" | "error" | "info";

type Toast = {
  id: string;
  message: string;
  type: ToastType;
};

type ToastStore = {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">, duration?: number) => void;
  removeToast: (id: string) => void;
  // Para showToast estilo "único"
  message: string;
  type: ToastType;
  visible: boolean;
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  hideToast: () => void;
};

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast, duration = 3000) => {
    const id = crypto.randomUUID();
    const newToast = { ...toast, id };
    set((state) => ({ toasts: [...state.toasts, newToast] }));

    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, duration);
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
  // Estado y métodos para showToast único
  message: "",
  type: "success",
  visible: false,
  showToast: (message, type = "success", duration = 3000) => {
    set({ message, type, visible: true });
    setTimeout(() => set({ visible: false }), duration);
  },
  hideToast: () => set({ visible: false }),
}));