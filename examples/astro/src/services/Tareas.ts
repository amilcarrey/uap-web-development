import fs from "fs";
import { saveState, state } from "../state";


// Definimos la interfaz para las tareas
export interface Task {
  id: number;
  text: string;
  completed: boolean;
}

// Agregar una nueva tarea
export function addTask(taskText: string): Task | false {
  if (!taskText || typeof taskText !== "string") return false;
  const task: Task = { id: Date.now(), text: taskText, completed: false };
  state.tasks.push(task);
  saveState();
  return task;
}

// Limpiar o eliminar tareas completadas
export function clearCompleted(): boolean {
  state.tasks = state.tasks.filter((t: Task) => !t.completed);
  saveState();
  return true;
}

// Eliminar una tarea
export function deleteTask(taskId: number): boolean {
  state.tasks = state.tasks.filter((t: Task) => t.id !== taskId);
  saveState();
  return true;
}

// Obtener tareas según filtro
export function getTasks(filter: string): Task[] {
  return state.tasks.filter((task: Task) =>
    filter === "all" ||
    (filter === "done" && task.completed) ||
    (filter === "undone" && !task.completed)
  );
}

// Actualizar una tarea
export function updateTask(taskId: number): Task | false {
  const task = state.tasks.find((t: Task) => t.id === taskId);
  if (task) {
    task.completed = !task.completed;
    saveState();
    return task; // Devuelve la tarea actualizada
  }
  return false;
}