import type { Task } from "../types/Task";

const BASE_URL = "/api/tasks";

export const fetchTasks = async (
  boardId: number,
  page = 1,
  limit = 5,
  filter: string = "all",
  search: string = ""
): Promise<Task[]> => {
  const url = new URL(`${BASE_URL}/${boardId}`, window.location.origin);
  url.searchParams.set("page", page.toString());
  url.searchParams.set("limit", limit.toString());
  if (filter) url.searchParams.set("filter", filter);
  if (search) url.searchParams.set("search", search);

  const res = await fetch(url.toString(), {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Error al obtener tareas");
  return res.json();
};

export const addTask = async ({
  boardId,
  text,
}: {
  boardId: number;
  text: string;
}): Promise<Task> => {
  const res = await fetch(`${BASE_URL}/${boardId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ text }),
  });

  if (!res.ok) throw new Error("Error al agregar tarea");
  return res.json();
};

export const toggleTask = async (id: number): Promise<void> => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error al actualizar tarea");
};

export const updateTaskText = async (
  id: number,
  text: string
): Promise<void> => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ text }),
  });

  if (!res.ok) throw new Error("Error al editar tarea");
};

export const deleteTask = async (id: number): Promise<void> => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Error al eliminar tarea");
};

export const clearCompleted = async (boardId: number): Promise<void> => {
  const res = await fetch(`${BASE_URL}/clear/${boardId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Error al limpiar completadas");
};