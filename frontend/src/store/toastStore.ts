// src/store/toastStore.ts
import { create } from "zustand";

interface Toast {
  id: number; // ⬅️ cambiado a number
  mensaje: string;
  tipo: "exito" | "error";
}

interface ToastStore {
  toasts: Toast[];
  agregarToast: (mensaje: string, tipo: "exito" | "error") => void;
  eliminarToast: (id: number) => void; // ⬅️ también cambiado a number
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  agregarToast: (mensaje, tipo) => {
    const id = Date.now(); // ID numérico basado en timestamp
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
