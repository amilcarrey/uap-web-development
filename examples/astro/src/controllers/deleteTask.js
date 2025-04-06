import { state } from "../state.js";

export function deleteTask(taskId) {
  state.tasks = state.tasks.filter(t => t.id !== Number(taskId));
  return true;
}