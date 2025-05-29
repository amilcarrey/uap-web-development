import { create } from "zustand";

export type Task = {
  id: number;
  name: string;
  completed: boolean;
};

export type Filter = "all" | "completed" | "pending";

type TaskState = {
  tasks: Task[];
  nextId: number;
  filter: Filter;
  addTask: (name: string) => void;
  toggleTask: (id: number) => void;
  deleteTask: (id: number) => void;
  clearCompleted: () => void;
  setFilter: (filter: Filter) => void;
};

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  nextId: 1,
  filter: "all",
  addTask: (name) =>
    set((state) => ({
      tasks: [
        ...state.tasks,
        { id: state.nextId, name, completed: false },
      ],
      nextId: state.nextId + 1,
    })),
  toggleTask: (id) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      ),
    })),
  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    })),
  clearCompleted: () =>
    set((state) => ({
      tasks: state.tasks.filter((task) => !task.completed),
    })),
  setFilter: (filter) => set(() => ({ filter })),
}));