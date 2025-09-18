import { create } from "zustand";
import type { Role } from "../utils/permissions";

export type Board = {
  id: string;
  name: string;
};

type State = {
  boards: Board[];
  setBoards: (boards: Board[]) => void;
  activeBoardId: string;
  setActiveBoardId: (id: string) => void;
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
};

export const useBoardStore = create<State>((set) => ({
  boards: [],
  setBoards: (boards) => set({ boards }),
  activeBoardId: "general",
  setActiveBoardId: (id) => set({ activeBoardId: id }),
  currentRole: "viewer",
  setCurrentRole: (role) => set({ currentRole: role }),
}));
