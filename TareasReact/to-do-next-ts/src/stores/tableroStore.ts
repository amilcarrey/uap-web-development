// stores/tableroStore.ts
import { create } from 'zustand';

type RolTablero = 'propietario' | 'editor' | 'lectura' | null;

interface TableroState {
  tableroId: string | null;
  rol: RolTablero;
  setTableroId: (id: string | null) => void;
  setRol: (rol: RolTablero) => void;
}

export const useTableroStore = create<TableroState>((set) => ({
  tableroId: null,
  rol: null,
  setTableroId: (id) => set({ tableroId: id }),
  setRol: (rol) => set({ rol }),
}));
