const BASE_URL = "http://localhost:4321/api/tareas";

export const fetchTareas = async (filter = 'all') => {
  const res = await fetch(`${BASE_URL}?filter=${filter}`);
  return await res.json();
};

export const addTarea = async (text: string) => {
  const res = await fetch(`${BASE_URL}/nuevo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "add", task: text }),
  });
  return await res.json();
};

export const toggleTarea = async (id: number) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "toggle", id }),
  });
  return await res.json();
};

export const deleteTarea = async (id: number) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "delete", id }),
  });
  return await res.json();
};

export const clearCompletadas = async () => {
  const res = await fetch(`${BASE_URL}/clear-completed`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "clear-completed" }),
  });
    return await res.json();
}

export const clearAll = async () => {
  const res = await fetch(`${BASE_URL}/clear-all`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "clear-all" }),
  });
  return await res.json();
}
