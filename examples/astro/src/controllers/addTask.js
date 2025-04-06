import { state } from "../state.js";

export function addTask(taskText) {
  if (!taskText || typeof taskText !== "string") return false;
  
  state.tasks.push({ id: Date.now(), text: taskText, completed: false });
  return true;
}