import type { Task } from "../types/Task";

const BASE_URL = "http://localhost:3001/tasks";

export const fetchTasks = async (board: string, page: number, limit = 5): Promise<Task[]> => {
  const res = await fetch(`${BASE_URL}?board=${board}&_page=${page}&_limit=${limit}`);
  if (!res.ok) throw new Error("Error al cargar tareas");
  return res.json();
};

export const addTask = async ({ text, board }: { text: string; board: string }): Promise<Task> => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, board, completed: false }),
  });
  if (!res.ok) throw new Error("Error al agregar tarea");
  return res.json();
};

export const toggleTask = async (id: number): Promise<void> => {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error("No se pudo obtener la tarea");
  const task = await res.json();

  const updated = {
    ...task,
    completed: !task.completed,
  };

  const patch = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updated),
  });

  if (!patch.ok) throw new Error("No se pudo actualizar la tarea");
};

export const deleteTask = async (id: number): Promise<void> => {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar tarea");
};

export const clearCompleted = async (board: string): Promise<void> => {
  const list = await fetch(`${BASE_URL}?board=${board}`).then((res) => res.json());
  for (const task of list.filter((t: Task) => t.completed)) {
    await fetch(`${BASE_URL}/${task.id}`, { method: "DELETE" });
  }
};

export const updateTaskText = async (id: number, newText: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error("No se pudo obtener la tarea");
  const task = await res.json();

  const updated = {
    ...task,
    text: newText,
  };

  const patch = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updated),
  });

  if (!patch.ok) throw new Error("No se pudo editar la tarea");
};