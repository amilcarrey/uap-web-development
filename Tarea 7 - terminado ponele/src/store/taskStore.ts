// src/store/taskStore.ts
import { create } from "zustand";
import type { Reminder } from "../types";

// En taskStore.ts
interface TaskStore {
  selectedTask: Reminder | null;
  confirmDeleteTask: Reminder | null;
  editingText: string;
  filter: string;
  page: number;

  setEditingText: (text: string) => void;
  setSelectedTask: (task: Reminder | null) => void;
  setConfirmDeleteTask: (task: Reminder | null) => void;
  setFilter: (filter: string) => void;
  setPage: (page: number) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  selectedTask: null,
  confirmDeleteTask: null,
  editingText: "",
  filter: "all",
  page: 1,

  setEditingText: (text) => set({ editingText: text }),
  setSelectedTask: (task) =>
    set({ selectedTask: task, editingText: task?.text ?? "" }),
  setConfirmDeleteTask: (task) => set({ confirmDeleteTask: task }),
  setFilter: (filter) => set({ filter }),
  setPage: (page) => set({ page }),
}));
