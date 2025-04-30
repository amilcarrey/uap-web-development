type Tarea = {
    id: number;
    texto: string;
    completada: boolean;
  };
  
  let tareas: Tarea[] = [];
  let id = 1;
  
  export function listar(filtro: string): Tarea[] {
    if (filtro === 'completadas') return tareas.filter(t => t.completada);
    if (filtro === 'pendientes') return tareas.filter(t => !t.completada);
    return tareas;
  }
  
  export function agregar(texto: string) {
    tareas.push({ id: id++, texto, completada: false });
  }
  
  export function alternar(idBuscar: number) {
    const tarea = tareas.find(t => t.id === idBuscar);
    if (tarea) tarea.completada = !tarea.completada;
  }
  
  export function eliminar(idBuscar: number) {
    tareas = tareas.filter(t => t.id !== idBuscar);
  }
  
  export function eliminarCompletadas() {
    tareas = tareas.filter(t => !t.completada);
  }
  
