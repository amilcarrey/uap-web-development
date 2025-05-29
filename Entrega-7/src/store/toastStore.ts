// src/store/toastStore.ts
import { create } from "zustand";

interface Toast {
  id: string;
  mensaje: string;
  tipo: "exito" | "error";
}

interface ToastStore {
  toasts: Toast[];
  agregarToast: (mensaje: string, tipo: "exito" | "error") => void;
  eliminarToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  agregarToast: (mensaje, tipo) => {
    const id = crypto.randomUUID();
    const nuevoToast = { id, mensaje, tipo };
    set((state) => ({ toasts: [...state.toasts, nuevoToast] }));

    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((toast) => toast.id !== id),
      }));
    }, 3000);
  },
  eliminarToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));
