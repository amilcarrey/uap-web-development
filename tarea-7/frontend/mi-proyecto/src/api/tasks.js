// src/api/tasks.js

const BASE_URL = '/api'; // Define una URL base para más claridad

// --- Funciones para Tableros (Boards) ---
export const getBoards = async () => {
  const response = await fetch(`${BASE_URL}/boards`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const createBoard = async (boardName) => {
  const response = await fetch(`${BASE_URL}/boards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: boardName }),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const deleteBoard = async (boardId) => {
  const response = await fetch(`${BASE_URL}/boards/${boardId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.ok;
};


// --- Funciones para Tareas (Ahora requieren boardId) ---
export const getTasks = async (boardId, filter = 'all', page = 1, limit = 5) => {
  if (!boardId) throw new Error("Board ID is required to fetch tasks."); // Validación
  const queryParams = new URLSearchParams({
    filter,
    page,
    limit,
  }).toString();

  const response = await fetch(`${BASE_URL}/boards/${boardId}/tasks?${queryParams}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const addTask = async (boardId, taskText) => { // Acepta boardId
  if (!boardId) throw new Error("Board ID is required to add a task.");
  const response = await fetch(`${BASE_URL}/boards/${boardId}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task: taskText }),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const toggleTaskCompletion = async (boardId, id) => { // Acepta boardId
  if (!boardId) throw new Error("Board ID is required to toggle task completion.");
  const response = await fetch(`${BASE_URL}/boards/${boardId}/tasks/toggle-completed/${id}`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.ok;
};

export const deleteTask = async (boardId, id) => { // Acepta boardId
  if (!boardId) throw new Error("Board ID is required to delete a task.");
  const response = await fetch(`${BASE_URL}/boards/${boardId}/tasks/delete-task/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.ok;
};

export const clearCompletedTasks = async (boardId) => { // Acepta boardId
  if (!boardId) throw new Error("Board ID is required to clear completed tasks.");
  const response = await fetch(`${BASE_URL}/boards/${boardId}/tasks/clear-completed`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.ok;
};

export const updateTask = async (boardId, id, updatedTaskData) => { // Acepta boardId
  if (!boardId) throw new Error("Board ID is required to update a task.");
  const response = await fetch(`${BASE_URL}/boards/${boardId}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedTaskData),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// --- NUEVAS Funciones para Configuraciones Globales ---
export const getGlobalConfig = async () => {
    const response = await fetch(`${BASE_URL}/config`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

export const updateGlobalConfig = async (configData) => {
    const response = await fetch(`${BASE_URL}/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configData),
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};