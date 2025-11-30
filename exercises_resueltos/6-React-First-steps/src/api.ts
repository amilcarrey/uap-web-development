import type { Task } from './types';

const STORAGE_KEY = 'tasks';

const load = (): Task[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const save = (tasks: Task[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

export const taskAPI = {
  list: (filter?: 'completed' | 'incomplete'): Task[] => {
    const tasks = load();
    if (filter === 'completed') return tasks.filter(t => t.completed);
    if (filter === 'incomplete') return tasks.filter(t => !t.completed);
    return tasks;
  },

  create: (text: string): Task => {
    const tasks = load();
    const newTask: Task = {
      id: Date.now(),
      text,
      completed: false
    };
    tasks.push(newTask);
    save(tasks);
    return newTask;
  },

  toggle: (id: number): Task | undefined => {
    const tasks = load();
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    task.completed = !task.completed;
    save(tasks);
    return task;
  },

  delete: (id: number): void => {
    let tasks = load();
    tasks = tasks.filter(t => t.id !== id);
    save(tasks);
  },

  clearCompleted: (): void => {
    let tasks = load();
    tasks = tasks.filter(t => !t.completed);
    save(tasks);
  }
};