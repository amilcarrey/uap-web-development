export type Task = {
    id: number;
    texto: string;
    completada: boolean;
  };
  
  let tareas: Task[] = [];
  
  export function getTareas(): Task[] {
    return tareas;
  }
  
  export function agregarTarea(texto: string) {
    tareas.push({
      id: Date.now(),
      texto,
      completada: false,
    });
  }
  
  export function borrarTarea(id: number) {
    tareas = tareas.filter((t) => t.id !== id);
  }
  
  export function toggleTarea(id: number) {
    const tarea = tareas.find((t) => t.id === id);
    if (tarea) tarea.completada = !tarea.completada;
  }
  
  export function limpiarCompletadas() {
    tareas = tareas.filter((t) => !t.completada);
  }
  