const BASE_URL = "http://localhost:4321/api/tareas";

const fetchJSON = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Error en la petición GET");
  return res.json();
};

const postJSON = async (url: string, body: Record<string, any>) => {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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

export function crearTablero(boardId: string) {
  const allBoards = JSON.parse(localStorage.getItem("tareas-by-board") || "{}");
  if (!allBoards[boardId]) {
    allBoards[boardId] = [];
    localStorage.setItem("tareas-by-board", JSON.stringify(allBoards));
  }
}