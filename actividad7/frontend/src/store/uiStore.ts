
import { create } from 'zustand';
import type { Task } from '../types/Task';

type Filter = 'all' | 'active' | 'completed';

interface UIState {
  filter: Filter;
  setFilter: (filter: Filter) => void;

  editingTask: Task | null;
  setEditingTask: (task: Task | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  filter: 'all',
  setFilter: (filter) => set({ filter }),

  editingTask: null,
  setEditingTask: (task) => set({ editingTask: task }),
}));
