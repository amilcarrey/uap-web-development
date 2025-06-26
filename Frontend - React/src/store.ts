import { create } from "zustand";
import { type Task } from "./types";

export type FilterOption = "all" | "done" | "undone";

interface TaskStore {
  currentFilter: FilterOption;
  setCurrentFilter: (filter: FilterOption) => void;

  selectedTableroId: number | null;
  setSelectedTableroId: (id: number | null) => void;

  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (updatedTask: Task) => void;
  removeTask: (taskId: number) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  currentFilter: "all",
  setCurrentFilter: (filter) => set({ currentFilter: filter }),

  selectedTableroId: null,
  setSelectedTableroId: (id) => set({ selectedTableroId: id }),

  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (updatedTask) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
    })),
  removeTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== taskId),
    })),
}));
