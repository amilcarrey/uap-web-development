import fs from "fs";

const FILE = "./tasks-data.json";

function loadTasks() {
  try {
    const data = fs.readFileSync(FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveTasks(tasks) {
  fs.writeFileSync(FILE, JSON.stringify(tasks, null, 2));
}

let tasks = loadTasks();

export function addTask(text) {
  tasks.push({ id: Date.now().toString(), text, completed: false });
  saveTasks(tasks);
}

export function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks(tasks);
}

export function toggleTask(id) {
  tasks = tasks.map((t) =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  saveTasks(tasks);
}

export function clearCompleted() {
  tasks = tasks.filter((t) => !t.completed);
  saveTasks(tasks);
}

export function filterTasks(status) {
  if (status === "completed") return tasks.filter((t) => t.completed);
  if (status === "pending") return tasks.filter((t) => !t.completed);
  return tasks;
}

export { tasks };
