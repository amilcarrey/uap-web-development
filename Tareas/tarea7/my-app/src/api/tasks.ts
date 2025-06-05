// src/api/tasks.ts
import { Task } from '../types/Task';

const API = 'http://localhost:4321'; // <-- Tu backend en Astro

export async function fetchTasks(boardId: string, page: number = 1, limit: number = 5) {
  const params = new URLSearchParams({
    tab: boardId,
    page: page.toString(),
    limit: limit.toString(),
  });

  const res = await fetch(`/api/tasks?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
}


export async function createTask(task: { description: string; boardId: string; completed?: boolean }) {
  const res = await fetch(`${API}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: task.description,
      boardId: task.boardId,
      completed: task.completed ?? false
    }),
  });

  if (!res.ok) throw new Error('Failed to create task');
  return res.json(); // { success: true, task: {...} }
}

export async function updateTask(id: number, updates: Partial<Task>) {
  const res = await fetch(`${API}/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });

  if (!res.ok) throw new Error('Failed to update task');
  return res.json();
}

export async function deleteTask(id: number) {
  const res = await fetch(`${API}/tasks/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) throw new Error('Failed to delete task');
}
