// frontend/src/api/tasks.js
import axios from 'axios';

// Usamos '/api/tasks' porque Vite lo proxyeará a http://localhost:4321/api/tasks
const BASE_URL = '/api/tasks';

export async function fetchTasks() {
  try {
    const response = await axios.get(BASE_URL);
    return response.data; // Array de tareas
  } catch (err) {
    const message = err.response?.data?.error || err.message || 'Error al cargar tareas';
    throw new Error(message);
  }
}

export async function createTask(text) {
  try {
    const response = await axios.post(
      BASE_URL,
      { text },
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data; // Tarea creada
  } catch (err) {
    const message = err.response?.data?.error || err.message || 'Error al crear tarea';
    throw new Error(message);
  }
}

export async function updateTask(id, data) {
  try {
    const response = await axios.put(
      `${BASE_URL}/${id}`,
      data,
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data; // Tarea actualizada
  } catch (err) {
    const message = err.response?.data?.error || err.message || 'Error al actualizar tarea';
    throw new Error(message);
  }
}

export async function deleteTask(id) {
  try {
    await axios.delete(`${BASE_URL}/${id}`);
    return;
  } catch (err) {
    const message = err.response?.data?.error || err.message || 'Error al borrar tarea';
    throw new Error(message);
  }
}

export async function clearCompleted() {
  try {
    await axios.delete(BASE_URL, {
      params: { completed: true }
    });
    return;
  } catch (err) {
    const message = err.response?.data?.error || err.message || 'Error al limpiar completadas';
    throw new Error(message);
  }
}
