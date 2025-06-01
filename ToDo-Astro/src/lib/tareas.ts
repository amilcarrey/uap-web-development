type Tablero = {
  id: string;
  nombre: string;
  alias: string;
}

type Tarea = {
    id: number;
    descripcion: string;
    completada: boolean;
    idTablero: string;
  };

let tableros: Tablero[] = [ 
  { id: "tb-1", nombre: "Personal", alias: "personal" },
  { id: "tb-2", nombre: "Configuracion", alias: "configuracion" },
];

let tareas: Tarea[] = [
  { id: 1, descripcion: "Limpiar pieza", completada: false, idTablero: "tb-1" }, 
  { id: 2, descripcion: "Barrer sala", completada: false, idTablero: "tb-1" },
  { id: 3, descripcion: "Lavar los platos", completada: false, idTablero: "tb-1" },
  { id: 4, descripcion: "Bañarme", completada: false, idTablero: "tb-1" },
];
  
export function listarTareas(idTablero: string, filtrar?: "completadas" | "pendientes"): Tarea[] {
  let tareasFiltradas = tareas.filter(t => t.idTablero === idTablero);
  
  if (filtrar === "completadas") return tareasFiltradas.filter(t => t.completada);
  if (filtrar === "pendientes") return tareasFiltradas.filter(t => !t.completada);
  return tareasFiltradas;
}
 
export function agregarTarea(descripcion: string, idTablero: string): Tarea | null {
  const nuevaTarea: Tarea = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    descripcion,
    completada: false,
    idTablero: idTablero 
  };

  const yaExiste = tareas.some(t => 
    t.descripcion === nuevaTarea.descripcion && 
    t.idTablero === idTablero
  );
  if (yaExiste) return null;

  tareas.push(nuevaTarea);
  return nuevaTarea;
}

  export function agregarTablero(nombre: string, alias: string): Tablero | null {
    const yaExiste = tableros.some(t => t.alias === alias);
    if (yaExiste) return null;

    const nuevoTablero: Tablero = {
      id: `tb-${Date.now()}`,
      nombre,
      alias
    };

    tableros.push(nuevoTablero);
    return nuevoTablero;
  }

  export function listarTableros(): Tablero[] {
    return tableros;
  }

  export function obtenerTablero(alias: string): Tablero | null {
    return tableros.find(t => t.alias === alias) || null;
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

export function actualizarDescripcion(id: number, nuevaDescripcion: string): boolean {
  const existe = tareas.some(t => t.id === id);
  if (!existe) return false;

  tareas = tareas.map(t =>
    t.id === id ? { ...t, descripcion: nuevaDescripcion } : t
  );

  return true;
}