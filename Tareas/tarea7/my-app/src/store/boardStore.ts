// src/store/boardStore.ts
import { create } from 'zustand';

interface BoardStore {
  currentBoard: string;
  boards: string[];
  setBoard: (boardId: string) => void;
  addBoard: () => void;
}

export const useBoardStore = create<BoardStore>((set, get) => ({
  currentBoard: '1',
  boards: ['1', '2'],
  setBoard: (boardId) => set({ currentBoard: boardId }),
  addBoard: () => {
    const nextId = (get().boards.length + 1).toString(); // ensure string ID
    set((state) => ({
      boards: [...state.boards, nextId],
      currentBoard: nextId,
    }));
  },
}));
