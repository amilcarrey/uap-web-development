import { state } from "../../services/state";

export const getTareas = () => state.tasks;

export const agregarTarea = (texto: string) => {
  const nueva = {
    id: crypto.randomUUID(),
    texto,
    completada: false,
  };
  state.tasks.push(nueva);
  return nueva;
};

export const borrarTarea = (id: string) => {
  state.tasks = state.tasks.filter(t => t.id !== id);
};

export const toggleTarea = (id: string) => {
  const tarea = state.tasks.find(t => t.id === id);
  if (tarea) tarea.completada = !tarea.completada;
  return tarea;
};

export const limpiarCompletadas = () => {
  state.tasks = state.tasks.filter(t => !t.completada);
};
