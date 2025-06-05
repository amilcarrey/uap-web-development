import type { Tarea } from "../types/tarea";


let lista_tareas: Tarea[] = [
  { id: 1, content: "Personal Work No.1", completed: false },
  { id: 2, content: "Personal Work No.2", completed: false },
  { id: 3, content: "Personal Work No.3", completed: false },
  { id: 4, content: "Personal Work No.4", completed: false },
  { id: 5, content: "Personal Work No.5", completed: false },
];

export function getTareas(filtro: string): Tarea[] {
  if (filtro === "completas") {
    return lista_tareas.filter(t => t.completed);
  }
  if (filtro === "incompletas") {
    return lista_tareas.filter(t => !t.completed);
  }
  return lista_tareas;
}

export function addTarea(content: string): Tarea {
  const nuevaTarea: Tarea = {
    id: Date.now(), // Ahora es number, no string
    content,
    completed: false,
  };
  lista_tareas.push(nuevaTarea);
  return nuevaTarea;
}

export function completeTarea(id: number): Tarea | null {
  const tarea = lista_tareas.find(t => t.id === id);
  if (!tarea) return null;
  tarea.completed = !tarea.completed;
  return tarea;
}

export function deleteTarea(id: number): Tarea | null {
  const index = lista_tareas.findIndex(t => t.id === id);
  if (index === -1) return null;
  const tarea = lista_tareas[index];
  lista_tareas.splice(index, 1);
  return tarea;
}

export function deleteTareasCompletadas(): void {
  lista_tareas = lista_tareas.filter(t => !t.completed);
}
