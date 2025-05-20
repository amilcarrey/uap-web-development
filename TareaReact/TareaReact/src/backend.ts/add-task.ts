import { state } from "./state";

export function addTask(taskText: string) {
  if (typeof taskText === 'string' && taskText.trim() !== '') {
    state.tasks.push({
      id: state.nextId++,
      task_content: taskText.trim(),
      completed: false,
    });
  }

  return [...state.tasks]; // devolvemos una copia del array actualizado
}
