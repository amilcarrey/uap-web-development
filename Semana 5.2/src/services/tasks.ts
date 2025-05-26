import type { Task } from "../types";

type State = {
  tasks: Task[];
};

const state: State = {
  tasks: [],
};

export const getTasks = async (filter?: string) => {
  if (!filter) {
    return state.tasks;
  }
  // REVISAR PARTE DE FILTROS 
  return state.tasks.filter((task) =>
    task.text.includes(filter)
  );
};

export const addTask = async (text: string) => {
  const task: Task = {
    id: crypto.randomUUID(),
    text,
    done: false,
  };

  state.tasks.push(task);
  return task;
};

export const completeTask = async (id: string) => {
  const task = state.tasks.find((task) => task.id === id);
  if (!task) {
    throw new Error("Task not found");
  }

  task.done = task.done ? false : true;
  return task;
};

export const deleteTask = async (id: string) => {
  state.tasks = state.tasks.filter((task) => task.id !== id);
};