import { state } from "./state";

export function clearCompleted() {
  state.tasks = state.tasks.filter((t) => !t.completed);
  return [...state.tasks];
}
