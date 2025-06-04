import { state } from "./state";

export function toggleTask(id: number) {
  const task = state.tasks.find((t) => t.id === id);
  if (!task) {
    throw new Error("Tarea no encontrada");
  }

  task.completed = !task.completed;
  return [...state.tasks];
}

export function deleteTask(id: number) {
  const taskExists = state.tasks.some((t) => t.id === id);
  if (!taskExists) {
    throw new Error("Tarea no encontrada");
  }

  state.tasks = state.tasks.filter((t) => t.id !== id);
  return [...state.tasks];
}
