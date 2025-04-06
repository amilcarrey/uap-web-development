import { state } from "../state.js";

export function clearCompleted() {
  state.tasks = state.tasks.filter(t => !t.completed);
  return true;
}