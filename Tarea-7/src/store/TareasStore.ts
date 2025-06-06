import { create } from "zustand";
import type { Tarea } from "../types/tarea";

interface EditingState {
  id: number | null;
  content: string;
}

interface TareasStore {
  page: number;
  setPage: (page: number) => void;
  search: string;                        
  setSearch: (term: string) => void; 

  editing: EditingState;
  startEditing: (id: number, content: string) => void;
  cancelEditing: () => void;
  setEditingContent: (content: string) => void;
}

export const useTareasStore = create<TareasStore>((set) => ({
  page: 1,

  editing: { id: null, content: "" },
  search: "",                          
  setSearch: (term) => set({ search: term }),  

  setPage: (page) => set({ page }),

  startEditing: (id, content) => set({ editing: { id, content } }),
  cancelEditing: () => set({ editing: { id: null, content: "" } }),
  setEditingContent: (content) =>
    set((state) => ({ editing: { ...state.editing, content } })),
}));
