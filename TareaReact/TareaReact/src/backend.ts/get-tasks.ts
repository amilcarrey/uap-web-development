import { state } from "./state";

export function getTasks(filter?: string) {
  if (filter === "completed") {
    return state.tasks.filter((t) => t.completed);
  }

  if (filter === "active") {
    return state.tasks.filter((t) => !t.completed);
  }

  return [...state.tasks]; // devolver copia para evitar mutaciones externas
}
