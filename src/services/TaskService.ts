// TaskService.ts
import type { Task } from "../types/Task";

const API = "http://localhost:3001/tasks";

export const fetchTasks = async (): Promise<Task[]> => {
  const res = await fetch(API);
  return res.json();
};

export const addTask = async (text: string): Promise<Task> => {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  return res.json();
};

export const toggleTask = async (id: number): Promise<void> => {
  await fetch(`${API}/${id}`, { method: "PATCH" });
};

export const deleteTask = async (id: number): Promise<void> => {
  await fetch(`${API}/${id}`, { method: "DELETE" });
};

export const clearCompleted = async (): Promise<void> => {
  await fetch(API, { method: "DELETE" });
};