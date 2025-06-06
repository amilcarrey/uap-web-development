// src/store/useNotificacionesStore.ts
import { create } from "zustand";

type Notificacion = {
  id: string;
  mensaje: string;
  tipo?: "success" | "error" | "info";
};

type NotificacionesState = {
  notificaciones: Notificacion[];
  agregar: (mensaje: string, tipo?: Notificacion["tipo"]) => void;
  eliminar: (id: string) => void;
};

export const useNotificacionesStore = create<NotificacionesState>((set) => ({
  notificaciones: [],
  agregar: (mensaje, tipo = "info") => {
    const id = crypto.randomUUID();
    set((state) => ({
      notificaciones: [...state.notificaciones, { id, mensaje, tipo }],
    }));
    // Removerla automáticamente después de 2s
    setTimeout(() => {
      set((state) => ({
        notificaciones: state.notificaciones.filter((n) => n.id !== id),
      }));
    }, 2000);
  },
  eliminar: (id) =>
    set((state) => ({
      notificaciones: state.notificaciones.filter((n) => n.id !== id),
    })),
}));

