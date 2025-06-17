import {
  addTask,
  deleteTask,
  getTasks,
  toggleTaskCompletion,
  deleteCompletedTasks,
  editTask,
  listarTareasPaginadas,
  contarTareasFiltradas
} from "../models/taskModel.js";

export async function getAllTasks(categoriaId?: string, filtro?: string) {
  return await getTasks(categoriaId, filtro as "completadas" | "pendientes");
}

export async function createTask(text: string, categoriaId: string) {
  if (!text || !categoriaId) {
    throw new Error("Texto y categoría son requeridos");
  }
  await addTask(text, categoriaId);
}

export async function removeTask(id: number) {
  if (!id) {
    throw new Error("El ID de la tarea es requerido");
  }
  await deleteTask(id);
}

export async function toggleTask(id: number) {
  if (!id) {
    throw new Error("El ID de la tarea es requerido");
  }
  await toggleTaskCompletion(id);
}

export async function removeCompletedTasks(categoriaId: string) {
  if (!categoriaId) {
    throw new Error("El ID de la categoría es requerido");
  }
  await deleteCompletedTasks(categoriaId);
}

export async function updateTask(id: number, text: string, categoriaId: string) {
  if (!id || !text || !categoriaId) {
    throw new Error("ID, texto y categoría son requeridos");
  }
  await editTask(id, text, categoriaId);
}


export async function listarTareasPaginadasService(
  page: number,
  pageSize: number,
  categoriaId?: string,
  filtro?: "completadas" | "pendientes"
) {
  const tasks = await listarTareasPaginadas(page, pageSize, categoriaId, filtro);
  const totalCount = await contarTareasFiltradas(categoriaId, filtro);
  return { tasks, totalCount };
}