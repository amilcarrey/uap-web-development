import { create } from "zustand";

interface EditingState {
  id: number | null;
  content: string;
}

type EstadoFiltro = "todas" | "completadas" | "incompletas";

interface TareasStore {
  page: number;
  setPage: (page: number) => void;

  search: string;
  setSearch: (term: string) => void;

  filterEstado: EstadoFiltro;
  setFilterEstado: (estado: EstadoFiltro) => void;

  editing: EditingState;
  startEditing: (id: number, content: string) => void;
  cancelEditing: () => void;
  setEditingContent: (content: string) => void;
}

export const useTareasStore = create<TareasStore>((set) => ({
  page: 1,
  setPage: (page) => set({ page }),

  search: "",
  setSearch: (term) => set({ search: term }),

  filterEstado: "todas",
  setFilterEstado: (estado) => set({ filterEstado: estado }),

  editing: { id: null, content: "" },
  startEditing: (id, content) => set({ editing: { id, content } }),
  cancelEditing: () => set({ editing: { id: null, content: "" } }),
  setEditingContent: (content) =>
    set((state) => ({ editing: { ...state.editing, content } })),
}));
