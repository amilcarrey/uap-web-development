// src/lib/tareas.ts

export type Tarea = {
  id: string;
  texto: string;
  completada: boolean;
};

declare global {
  var tareas: Tarea[] | undefined;
}

if (!globalThis.tareas) {
  globalThis.tareas = [];
}

let tareas = globalThis.tareas as Tarea[];

export function obtenerTareas(filtro: string = "all"): Tarea[] {
  if (filtro === "completed") return tareas.filter((t) => t.completada);
  if (filtro === "incomplete") return tareas.filter((t) => !t.completada);
  return tareas;
}

export function agregarTarea(texto: string) {
  tareas.push({ id: crypto.randomUUID(), texto, completada: false });
}

export function eliminarTarea(id: string) {
  tareas = tareas.filter((t) => t.id !== id);
  globalThis.tareas = tareas;
}

export function toggleTarea(id: string) {
  const tarea = tareas.find((t) => t.id === id);
  if (tarea) tarea.completada = !tarea.completada;
}

export function limpiarCompletadas() {
  tareas = tareas.filter((t) => !t.completada);
  globalThis.tareas = tareas;
}

export function eliminarTodas() {
  tareas = [];
  globalThis.tareas = tareas;
}

export function obtenerTodas(): Tarea[] {
  return tareas;
}
