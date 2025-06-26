
const BASE_URL = "http://localhost:3001/api/tareas";

const fetchJSON = async (url: string) => {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error("Error en la petición GET");
  return res.json();
};

const postJSON = async (url: string, body: Record<string, any>) => {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Error en la petición POST");
  return res.json();
};

export async function fetchTareas(filter: string, page = 1, limit = 5, boardId = "personal") {
  const url = `${BASE_URL}?filter=${encodeURIComponent(filter)}&page=${page}&limit=${limit}&mode=${boardId}`;
  const json = await fetchJSON(url);

  return {
    tareas: json.tasks,
    totalPages: json.totalPages,
    currentPage: json.currentPage,
  };
}

export const addTarea = (text: string, boardId: string) =>
  postJSON(`${BASE_URL}/nuevo`, { action: "add", task: text, mode: boardId });

export const toggleTarea = (id: number, boardId: string) =>
  postJSON(`${BASE_URL}/${id}`, { action: "toggle", id, mode: boardId });

export const deleteTarea = (id: number, boardId: string) =>
  postJSON(`${BASE_URL}/${id}`, { action: "delete", id, mode: boardId });

export const clearCompletadas = (boardId: string) =>
  postJSON(`${BASE_URL}/clear-completed`, { action: "clear-completed", mode: boardId });

export const clearAll = (boardId: string) =>
  postJSON(`${BASE_URL}/clear-all`, { action: "clear-all", mode: boardId });

export const updateTarea = (id: number, task: string, boardId: string) =>
  postJSON(`${BASE_URL}/edit`, { action: "edit", id, task, mode: boardId });



export async function fetchBoards() {
  const res = await fetch("http://localhost:3001/api/boards", {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error al obtener tableros");
  return res.json();
}

export async function createBoard(name: string) {
  const res = await fetch("http://localhost:3001/api/boards", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("Error al crear tablero");
  return res.json();
}

export async function fetchUserConfig() {
  const res = await fetch("http://localhost:3001/api/user/config", {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error al obtener configuración");
  return res.json();
}

export async function updateUserConfig(config: any) {
  const res = await fetch("http://localhost:3001/api/user/config", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(config),
  });
  if (!res.ok) throw new Error("Error al actualizar configuración");
  return res.json();
}

export async function deleteBoard(boardId: string) {
  const res = await fetch(`http://localhost:3001/api/boards/${boardId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error al eliminar tablero");
  return res.json();
}

// Trae la lista de permisos (usuarios y roles) de un tablero
export async function fetchBoardPermissions(boardId: string) {
  const res = await fetch(`http://localhost:3001/api/boards/${boardId}/permissions`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error al obtener permisos");
  return res.json();
}

// Asigna/cambia permiso a un usuario
export async function setBoardPermission(boardId: string, targetUserId: string, role: "editor" | "viewer") {
  const res = await fetch(`http://localhost:3001/api/boards/${boardId}/permissions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ targetUserId, role }),
  });
  if (!res.ok) throw new Error("Error al actualizar permisos");
  return res.json();
}
export async function removeBoardPermission(boardId: string, targetUserId: string) {
  const res = await fetch(`http://localhost:3001/api/boards/${boardId}/permissions/${targetUserId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error al eliminar permiso");
  return res.json();
}


export async function shareBoard(boardId: string, targetUsername: string, role: "editor" | "viewer") {
  const res = await fetch(`http://localhost:3001/api/boards/share`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ boardId, targetUsername, role }),
  });
  if (!res.ok) {
    let errorMsg = "Error al compartir tablero";
    try {
      const json = await res.json();
      if (json?.error) errorMsg = json.error;
    } catch {}
    throw new Error(errorMsg);
  }
  return res.json();
}

