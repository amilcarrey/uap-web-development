export type Tarea = {
  id: string;
  texto: string;
  completada: boolean;
};

type State = {
  tareas: Tarea[];
};

// Estado en memoria (se borra al reiniciar el servidor)
const state: State = {
  tareas: [],
};

// Obtener todas las tareas
export const getTareas = (): Tarea[] => {
  return state.tareas;
};

// Agregar nueva tarea
export const agregarTarea = (texto: string): Tarea => {
  const nueva: Tarea = {
    id: crypto.randomUUID(),
    texto,
    completada: false,
  };
  state.tareas.push(nueva);
  return nueva;
};

// Alternar completada
// Consigna 3: Capacidad de completar y descompletar una tarea al clickear en su correspondiente checkbox.
export const toggleTarea = (id: string): Tarea | undefined => {
  const tarea = state.tareas.find((t) => t.id === id);
  if (tarea) {
    tarea.completada = !tarea.completada;
  }
  return tarea;
};

// Borrar una tarea
// Consigna 4: Capacidad de eliminar una tarea de la lista.
export const borrarTarea = (id: string): void => {
  state.tareas = state.tareas.filter((t) => t.id !== id);
};

// Limpiar todas las completadas
// Consigna 5: Eliminar todas las tareas ya completadas al clickear el botón de Clear Completed.
export const limpiarCompletadas = (): void => {
  state.tareas = state.tareas.filter((t) => !t.completada);
};
