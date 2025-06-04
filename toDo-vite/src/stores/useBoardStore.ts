import { create } from "zustand";
import { nanoid } from "nanoid";

type Board = {
  id: string;
  name: string;
};

type BoardStore = {
  boards: Board[];
  addBoard: (name: string) => void;
  removeBoard: (id: string) => void;
};

export const useBoardStore = create<BoardStore>((set) => ({
  boards: [
    { id: "profesional", name: "Profesional" },
    { id: "personal", name: "Personal" },
  ],
  addBoard: (name) =>
    set((state) => ({
      boards: [...state.boards, { id: nanoid(), name }],
    })),
  removeBoard: (id) =>
    set((state) => ({
      boards: state.boards.filter((board) => board.id !== id),
    })),
}));
