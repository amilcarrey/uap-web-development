import { state } from "../state.js";

export function updateTask(taskId) {
  const task = state.tasks.find(t => t.id === Number(taskId));
  if (task) {
    task.completed = !task.completed;
    return true;
  }
  return false;
}