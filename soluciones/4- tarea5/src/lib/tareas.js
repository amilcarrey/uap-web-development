// Base de datos falsa en memoria
let tareas = [
  { id: 1, texto: 'Estudiar', completado: false, categoria: 'personal' },
  { id: 2, texto: 'Entregar tp', completado: true, categoria: 'profesional' },
];

export function obtenerTareas(filtroEstado = 'all', categoria = 'personal') {
  return tareas.filter(t => {
    const coincideCategoria = t.categoria === categoria;
    if (filtroEstado === 'completed') return t.completado && coincideCategoria;
    if (filtroEstado === 'incomplete') return !t.completado && coincideCategoria;
    return coincideCategoria;
  });
}

export function agregarTarea(texto, categoria = 'personal') {
  tareas.push({
    id: Date.now(),
    texto,
    completado: false,
    categoria,
  });
}

export function toggleTarea(id) {
  tareas = tareas.map(t => t.id == id ? { ...t, completado: !t.completado } : t);
}

export function eliminarTarea(id) {
  tareas = tareas.filter(t => t.id != id);
}

export function limpiarCompletadas(categoria = 'personal') {
  tareas = tareas.filter(t => !(t.completado && t.categoria === categoria));
}
