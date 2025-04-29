
type Tarea = {
    id: number;
    descripcion: string;
    completada: boolean;
  };
  
  let tareas: Tarea[] = [];
  
  export function obtenerTareas(): Tarea[] {
    return tareas;
  }
  
  export function guardarTareas(nuevasTareas: Tarea[]) {
    tareas = nuevasTareas;
  }
  
  export function agregarTarea(descripcion: string) {
    tareas.push({
      id: Date.now(),
      descripcion,
      completada: false
    });
  }
  
  export function alternarEstado(id: number) {
    const tarea = tareas.find(t => t.id === id);
    if (tarea) {
      tarea.completada = !tarea.completada;
    }
  }
  
  export function eliminarTarea(id: number) {
    try {
      const tareaExistente = tareas.find(t => t.id === id);
      if (!tareaExistente) {
        console.error(`Tarea no encontrada para eliminar: ${id}`);
        throw new Error('Tarea no encontrada');
      }
      tareas = tareas.filter(t => t.id !== id);
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
      throw new Error('Error al eliminar tarea');
    }
  }
  
  export const obtenerEstado = (id: number): boolean | undefined => {
    const tarea = tareas.find(t => t.id === id);
    return tarea ? tarea.completada : undefined; // Devuelve el estado de completada o undefined si no la encuentra
  };
  
  export function limpiarCompletadas() {
    tareas = tareas.filter(t => !t.completada);
  }
  
  export function obtenerFiltrado(filtro: "all" | "complete" | "incomplete"): Tarea[] {
    if (filtro === "complete") {
      return tareas.filter(t => t.completada);
    }
    if (filtro === "incomplete") {
      return tareas.filter(t => !t.completada);
    }
    return tareas;
  }

  export function renderTareas(tareasFiltradas: Tarea[]): string {
    if (tareasFiltradas.length === 0) {
      return `<p class="text-center text-gray-600">Sin tareas.</p>`;
    }
  
    return tareasFiltradas.map(tarea => `
      <div class="flex items-center justify-between bg-orange-50 p-3 rounded mb-3 ${tarea.completada ? 'line-through text-gray-500' : ''}">
        <form method="POST" action="/api/tareas/toggle" class="inline">
          <input type="hidden" name="id" value="${tarea.id}" />
          <button type="submit" class="text-xl">${tarea.completada ? '🔄' : '✔️'}</button>
        </form>
        <span class="flex-1 mx-4">${tarea.descripcion}</span>
        <form method="POST" action="/api/tareas/delete" class="inline">
          <input type="hidden" name="id" value="${tarea.id}" />
          <button type="submit" class="text-xl">🗑️</button>
        </form>
      </div>
    `).join('');
  }
  