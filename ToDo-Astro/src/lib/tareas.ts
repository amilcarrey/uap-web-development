type Tarea = {
    id: number;
    descripcion: string;
    completada: boolean;
  };
  
  let tareas = [
    { id: 1, descripcion: "Limpiar pieza", completada: false },
    { id: 2, descripcion: "Barrer sala", completada: false },
    { id: 3, descripcion: "Lavar los platos", completada: false },
    { id: 4, descripcion: "Bañarme", completada: false },
  ];
  
  export function listarTareas(filtrar?: "completadas" | "pendientes"): Tarea[] {
    if (filtrar === "completadas") return tareas.filter((t) => t.completada);
    if (filtrar === "pendientes") return tareas.filter((t) => !t.completada);
    return tareas;
  }
 
export function agregarTarea(descripcion: string): Tarea | null {
  const nuevaTarea: Tarea = {
    id: Date.now(),
    descripcion,
    completada: false
  };

  const yaExiste = tareas.some(t => t.descripcion === nuevaTarea.descripcion);
  if (yaExiste) return null;

  tareas.push(nuevaTarea);

  return nuevaTarea;
}
  
  export function actualizarEstado(id: number) {
    tareas = tareas.map((t) =>
      t.id === id ? { ...t, completada: !t.completada } : t
    );
  }
  
  export function eliminarTarea(id: number): boolean {
    const tarea = tareas.find((t) => t.id === id);
    tareas = tareas.filter((t) => t.id !== id);
    return true;
  }
  
export function eliminarCompletadas(): number[] {
  const idsEliminadas = tareas.filter(t => t.completada).map(t => t.id);
  tareas = tareas.filter(t => !t.completada);
  return idsEliminadas;
}
  