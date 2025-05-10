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

export function deleteTask(id: number) {
  tasks = tasks.filter((task) => task.id !== id);
}

export function toggleTask(id: number) {
    const task = tasks.find(t => t.id === id);
  
    if (!task) return false;
  
    task.completed = !task.completed;
    return true;
  }

export function clearCompleted() {
  tasks = tasks.filter((t) => !t.completed);
}
