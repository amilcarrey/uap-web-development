// src/api/tareas.ts
import {type Tarea } from "../types/types";

const API_URL = "http://localhost:3000/tareas";

// Obtener todas las tareas
export const fetchTareas = async (): Promise<Tarea[]> => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al cargar tareas");
  return res.json();
};

// Agregar una tarea nueva
export const addTarea = async (newTarea: Omit<Tarea, "id">): Promise<Tarea> => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newTarea),
  });
  if (!res.ok) throw new Error("Error al agregar tarea");
  return res.json();
};

// Actualizar una tarea
export const updateTarea = async (updatedTarea: Partial<Tarea> & { id: number }): Promise<Tarea> => {
  const res = await fetch(`${API_URL}/${updatedTarea.id}`, {
    method: "PATCH", // PATCH actualiza solo campos
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedTarea),
  });
  if (!res.ok) throw new Error("Error al actualizar tarea");
  return res.json();
};

// Eliminar una tarea por id
export const deleteTarea = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar tarea");
};
