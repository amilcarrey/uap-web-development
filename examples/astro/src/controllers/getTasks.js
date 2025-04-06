import { state } from "../state.js";

export function getTasks(filter) {
  return state.tasks.filter(task =>
    filter === "all" ||
    (filter === "done" && task.completed) ||
    (filter === "undone" && !task.completed)
  );
}