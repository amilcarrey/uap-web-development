// import { create } from 'zustand';
// import { BASE_URL } from '../hooks/useTasks';

// export type Board = {
//   id: string;
//   name: string;
// };

// type BoardState = {
//   boards: Board[];
//   addBoard: (name: string) => void;
//   removeBoard: (id: string) => void;
//   activeBoardId: string;
//   setActiveBoard: (id: string) => void;
// };

// export const useBoardStore = create<BoardState>((set) => ({
//   boards: [{ id: 'general', name: 'General Board' }],

//   addBoard: async (name) => {
//     const response = await fetch(`${BASE_URL}/agregarTablero`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({ name }),
//     });
//     if (!response.ok) {
//       throw new Error('Failed to add board');
//     }
//     const newBoard = await response.json();
//     set((state) => ({
//       boards: [...state.boards, newBoard],
//       activeBoardId: newBoard.id,
//     }));
//   },
      
//   removeBoard: async (id) => {
//     await fetch(`${BASE_URL}/eliminarTablero`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({ id }),
//     });

//     set((state) => ({
//       boards: state.boards.filter((board) => board.id !== id),
//       activeBoardId: state.activeBoardId === id ? 'general' : state.activeBoardId,
//     }));
//   },

//   activeBoardId: 'general',

//   setActiveBoard: (id) => set({ activeBoardId: id }),
// }));


import { create } from "zustand";

export type Board = {
  id: string;
  name: string;
};

type State = {
  boards: Board[];
  setBoards: (boards: Board[]) => void;
  activeBoardId: string;
  setActiveBoardId: (id: string) => void;
};

export const useBoardStore = create<State>((set) => ({
  boards: [],
  setBoards: (boards) => set({ boards }),
  activeBoardId: "general",
  setActiveBoardId: (id) => set({ activeBoardId: id }),
}));
