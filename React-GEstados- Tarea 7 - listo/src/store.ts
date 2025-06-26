import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Tarea = {
  id: number;
  text: string;
  completada: boolean;
  boardId: string;
};

interface UIStore {
  tareaEditando: Tarea | null;
  setTareaEditando: (tarea: Tarea | null) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  tareaEditando: null,
  setTareaEditando: (tarea) => set({ tareaEditando: tarea }),
  currentPage: 1,
  setCurrentPage: (page) => set({ currentPage: page }),
}));

interface TaskStore {
  filter: string;
  setFilter: (filter: string) => void;
  limit: number;
  setLimit: (limit: number) => void;
  pageByBoard: Record<string, number>;
  setPage: (boardId: string, page: number) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  filter: "all",
  setFilter: (filter) => set({ filter }),
  limit: 5,
  setLimit: (limit) => set({ limit }),
  pageByBoard: {},
  setPage: (boardId, page) =>
    set((state) => ({
      pageByBoard: { ...state.pageByBoard, [boardId]: page },
    })),
}));

// ---- CAMBIO IMPORTANTE AQUÍ ----

export interface Board {
  id: string;
  name: string;
  owner: string;
}

interface BoardStore {
  boards: Board[];
  setBoards: (boards: Board[]) => void;
  addBoard: (board: Board) => void;
  removeBoard: (id: string) => void;
}

export const useBoardStore = create<BoardStore>()(
  persist(
    (set) => ({
      boards: [],
      setBoards: (boards: Board[]) => set({ boards }),
      addBoard: (board: Board) => set((state) => ({ boards: [...state.boards, board] })),
      removeBoard: (id: string) =>
        set((state) => ({
          boards: state.boards.filter((board) => board.id !== id),
        })),
    }),
    { name: "board-storage" }
  )
);

// ---------------------------------

interface ConfigStore {
  refetchInterval: number;
  mostrarMayusculas: boolean;
  tareasPorPagina: number;
  setConfig: (config: Partial<ConfigStore>) => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useConfigStore = create<ConfigStore>()(
  persist(
    (set) => ({
      refetchInterval: 10000,
      mostrarMayusculas: false,
      tareasPorPagina: 5,
      _hasHydrated: false,
      setConfig: (config) => set((state) => ({ ...state, ...config })),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: 'config-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

interface UserStore {
  user: { username: string } | null;
  isLogged: boolean;
  setUser: (user: { username: string } | null) => void;
  setLogged: (logged: boolean) => void;
  checkingAuth: boolean;
  setCheckingAuth: (v: boolean) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isLogged: false,
  checkingAuth: true,
  setUser: (user) => set({ user, isLogged: !!user }),
  setLogged: (isLogged) => set({ isLogged }),
  setCheckingAuth: (v) => set({ checkingAuth: v }),
}));
