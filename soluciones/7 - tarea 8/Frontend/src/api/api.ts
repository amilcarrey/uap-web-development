import { API_BASE_URL } from "./config";

// --- Auth ---
export async function register(email: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error en registro");
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error en login");
}

export async function logout() {
  const res = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error en logout");
}

export async function getUser() {
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("No autorizado");
  return await res.json();
}

// --- Boards ---
export async function getBoards() {
  const res = await fetch(`${API_BASE_URL}/boards`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error cargando tableros");
  return await res.json();
}

export async function getBoardById(boardId: number) {
  const res = await fetch(`${API_BASE_URL}/boards/${boardId}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("No se encontró el tablero");
  return await res.json();
}

export async function createBoard(title: string) {
  const res = await fetch(`${API_BASE_URL}/boards`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error("Error creando tablero");
  return await res.json();
}

export async function deleteBoard(boardId: number) {
  const res = await fetch(`${API_BASE_URL}/boards/${boardId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error eliminando tablero");
}

// Compartir tablero
export async function shareBoard(boardId: number, email: string, permission: string) {
  const res = await fetch(`${API_BASE_URL}/boards/${boardId}/share`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, permission }),
  });
  if (!res.ok) throw new Error("Error compartiendo tablero");
}

// --- Tasks ---
export async function getTasks(
  boardId: number,
  page = 1,
  search = "",
  completed?: boolean
) {
  const url = new URL(`${API_BASE_URL}/tasks`);
  url.searchParams.append("boardId", boardId.toString());
  url.searchParams.append("page", page.toString());
  if (search) url.searchParams.append("search", search);
  if (completed !== undefined) url.searchParams.append("completed", completed.toString());

  const res = await fetch(url.toString(), { credentials: "include" });
  if (!res.ok) throw new Error("Error cargando tareas");
  return await res.json();
}

export async function createTask(boardId: number, content: string) {
  const res = await fetch(`${API_BASE_URL}/tasks`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ boardId, content }),
  });
  if (!res.ok) throw new Error("Error creando tarea");
  return await res.json();
}

export async function updateTask(taskId: number, data: Partial<{ content: string; completed: boolean }>) {
  const res = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error actualizando tarea");
}

export async function deleteTask(taskId: number) {
  const res = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error eliminando tarea");
}

export async function deleteCompletedTasks(boardId: number) {
  const res = await fetch(`${API_BASE_URL}/tasks/completed?boardId=${boardId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error eliminando tareas completadas");
}

// --- User Settings ---
export interface UserSettings {
  updateInterval: number;
  taskDisplayMode: "compact" | "detailed";
}

export async function getUserSettings(): Promise<UserSettings> {
  const res = await fetch(`${API_BASE_URL}/users/settings`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error cargando configuración");
  return await res.json();
}

export async function updateUserSettings(settings: UserSettings) {
  const res = await fetch(`${API_BASE_URL}/users/settings`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings),
  });
  if (!res.ok) throw new Error("Error guardando configuración");
}
export async function me() {
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("No autorizado");
  return await res.json();
}


