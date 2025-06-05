import { create } from 'zustand';
import { toast } from 'react-toastify';

interface AppState {
  filtro: 'all' | 'completed' | 'incomplete';
  setFiltro: (filtro: 'all' | 'completed' | 'incomplete') => void;
  editingTarea: { id: string; content: string } | null;
  setEditingTarea: (tarea: { id: string; content: string } | null) => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

export const useAppStore = create<AppState>((set) => ({
  filtro: 'all',
  setFiltro: (filtro) => set({ filtro }),
  editingTarea: null,
  setEditingTarea: (tarea) => set({ editingTarea: tarea }),
  showToast: (message, type) => {
    if (type === 'success') toast.success(message);
    else toast.error(message);
  },
}));