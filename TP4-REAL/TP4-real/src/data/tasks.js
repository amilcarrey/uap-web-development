import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const file = path.join(path.dirname(fileURLToPath(import.meta.url)), 'tasks.json');

function readTasks() {
  if (!fs.existsSync(file)) return [];
  const data = fs.readFileSync(file, 'utf-8');
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeTasks(tasks) {
  fs.writeFileSync(file, JSON.stringify(tasks, null, 2));
}

export function getTasks(filter = 'all') {
  const tasks = readTasks();
  if (filter === 'active') return tasks.filter(t => !t.completed);
  if (filter === 'completed') return tasks.filter(t => t.completed);
  return tasks;
}

export function addTask(text) {
  const tasks = readTasks();
  tasks.push({ text, completed: false });
  writeTasks(tasks);
}

export function toggleTask(index) {
  const tasks = readTasks();
  if (tasks[index]) {
    tasks[index].completed = !tasks[index].completed;
    writeTasks(tasks);
  }
}

export function deleteTask(index) {
  const tasks = readTasks();
  if (tasks[index]) {
    tasks.splice(index, 1);
    writeTasks(tasks);
  }
}

export function clearCompleted() {
  const tasks = readTasks().filter(t => !t.completed);
  writeTasks(tasks);
}
