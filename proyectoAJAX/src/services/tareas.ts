import type { Tarea } from '../types';
  
  declare global {
    var tareas: Tarea[] | undefined;
  }
  
  if (!globalThis.tareas) {
    globalThis.tareas = [];
  }
  
  let tareas = globalThis.tareas as Tarea[];
  
  export function obtenerTareas(filtro: string = 'all'): Tarea[] {
    if (filtro === 'completed') return tareas.filter(t => t.completada);
    if (filtro === 'incomplete') return tareas.filter(t => !t.completada);
    return tareas;
  }
  
  export function agregarTarea(texto: string): Tarea {
    const nuevaTarea: Tarea = { id: crypto.randomUUID(), texto, completada: false };
    tareas.push(nuevaTarea);
    return nuevaTarea;
  }
  
  export function eliminarTarea(id: string): void {
    tareas = tareas.filter(t => t.id !== id);
    globalThis.tareas = tareas;
  }
  
  export function toggleTarea(id: string): void {
    const tarea = tareas.find(t => t.id === id);
    if (tarea) tarea.completada = !tarea.completada;
  }
  
  export function limpiarCompletadas(): void {
    tareas = tareas.filter(t => !t.completada);
    globalThis.tareas = tareas;
  }