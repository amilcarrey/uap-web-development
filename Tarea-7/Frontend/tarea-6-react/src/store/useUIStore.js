// src/store/useUIStore.js
import { create } from 'zustand';

export const useUIStore = create((set) => ({
  filter: 'all',
  setFilter: (filter) => set({ filter }),

  // NUEVO: tarea en edición
  editingTask: null,
  setEditingTask: (task) => set({ editingTask: task }),
  clearEditingTask: () => set({ editingTask: null }),
}));
