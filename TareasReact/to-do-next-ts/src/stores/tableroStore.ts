// stores/tableroStore.ts
import { create } from 'zustand';

export const useTableroStore = create<{
  tableroId: string | null;
  setTableroId: (id: string | null) => void; // ← Aceptar null
}>((set) => ({
  tableroId: null,
  setTableroId: (id) => set({ tableroId: id }),
}));
