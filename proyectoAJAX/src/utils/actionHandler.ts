import { obtenerTareas, agregarTarea, eliminarTarea, toggleTarea, limpiarCompletadas } from '../services/tareas';

export function ejecutarAccion(accion: string, texto: string, id: string, filtro: string) {
  let nuevaTarea = null;
  
  switch (accion) {
    case 'agregar':
      if (texto.trim()) nuevaTarea = agregarTarea(texto.trim());
      break;
    case 'eliminar':
      if (id) eliminarTarea(id);
      break;
    case 'toggle':
      if (id) toggleTarea(id);
      break;
    case 'limpiar':
      limpiarCompletadas();
      break;
  }

  return { nuevaTarea, tareas: obtenerTareas(filtro) };
}