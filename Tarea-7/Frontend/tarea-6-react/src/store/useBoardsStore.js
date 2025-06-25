// src/store/useBoardsStore.js
import { create } from 'zustand';
import { nanoid } from 'nanoid';

export const useBoardsStore = create((set) => ({
  boards: [{ id: 'default', name: 'Principal' }],
  current: 'default',

  addBoard: (name) =>
    set((state) => {
      const newBoard = { id: nanoid(), name };
      return {
        boards: [...state.boards, newBoard],
        current: newBoard.id,
      };
    }),

  deleteBoard: (id) =>
    set((state) => ({
      boards: state.boards.filter((b) => b.id !== id),
      current: state.current === id ? 'default' : state.current,
    })),

  setCurrent: (id) => set({ current: id }),
}));
