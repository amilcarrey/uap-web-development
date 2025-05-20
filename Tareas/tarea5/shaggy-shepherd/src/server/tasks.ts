// src/server/tasks.ts
export let tasks: { id: number; text: string; completed: boolean }[] = [];

export function getTasks() {
  return tasks;
}

export function addTask(text: string) {
  const newTask = { id: Date.now(), text, completed: false };
  tasks.push(newTask);
  console.log("Task added:", newTask);
  return newTask;
}

// esto devolvia void al no tener un tipo de retorno. y despues en la api, cuando queria checkear si la tarea existia, no funcionaba
export function deleteTask(id: number): boolean {
  const prevLength = tasks.length;
  tasks = tasks.filter((task) => task.id !== id);
  return tasks.length < prevLength;
}

export function toggleTask(id: number): boolean {
  const task = tasks.find((t) => t.id === id);
  if (!task) return false;

  task.completed = !task.completed;
  return true;
}


export function clearCompleted() {
  tasks = tasks.filter((t) => !t.completed);
}
