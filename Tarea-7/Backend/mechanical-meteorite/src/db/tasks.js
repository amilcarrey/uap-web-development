let tasks = [
  { id: 1, description: "Tarea 1", completed: false },
  { id: 2, description: "Tarea 2", completed: true },
];

export function getTasks() {
  return tasks;
}

export function addTask(task) {
  const newTask = { ...task, id: Date.now(), completed: false };
  tasks.push(newTask);
  return newTask;
}

export function updateTask(id, updates) {
  const task = tasks.find(t => t.id === id);
  if (!task) return null;
  Object.assign(task, updates);
  return task;
}

export function deleteTask(id) {
  const index = tasks.findIndex(t => t.id === id);
  if (index !== -1) {
    tasks.splice(index, 1);
    return true;
  }
  return false;
}
