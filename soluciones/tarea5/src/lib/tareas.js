// Base de datos falsa en memoria
let tareas = [
  { id: 1, texto: 'Estudiar', completado: false },
  { id: 2, texto: 'Entregar tp', completado: true },
];

export function obtenerTareas(filtro = 'all') {
  if (filtro === 'completed') return tareas.filter(t => t.completado);
  if (filtro === 'incomplete') return tareas.filter(t => !t.completado);
  return tareas;
}

export function agregarTarea(texto) {
  tareas.push({
    id: Date.now(),
    texto,
    completado: false,
  });
}

export function toggleTarea(id) {
  tareas = tareas.map(t => t.id == id ? { ...t, completado: !t.completado } : t);
}

export function eliminarTarea(id) {
  tareas = tareas.filter(t => t.id != id);
}

export function limpiarCompletadas() {
  tareas = tareas.filter(t => !t.completado);
}
