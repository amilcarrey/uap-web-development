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
  
  export function agregarTarea(descripcion: string) {
    const nuevaTarea: Tarea = {
      id: Date.now(),
      descripcion,
      completada: false
    };
  
    const yaExiste = tareas.some(t => t.descripcion === nuevaTarea.descripcion);
    if (yaExiste) return;
  
    tareas.push(nuevaTarea);
  }
  
  
  export function actualizarEstado(id: number) {
    tareas = tareas.map((t) =>
      t.id === id ? { ...t, completada: !t.completada } : t
    );
  }
  
  export function eliminarTarea(id: number) {
    const tarea = tareas.find((t) => t.id === id);
    //validacion por si no encuentro la tarea o si fue realizada no pueda eliminarla
    if(!tarea) return;
    if(tarea.completada) return;
    tareas = tareas.filter((t) => t.id !== id);
  }
  
  export function eliminarCompletadas(){
    tareas = tareas.filter((t) => !t.completada);
  }
  