import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data', 'tareas.json');

export type Tarea = {
  id: string;
  texto: string;
  tableroId: string;
  completada: boolean;
};

function asegurarArchivo() {
  if (!fs.existsSync(DATA_PATH)) {
    fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
    fs.writeFileSync(DATA_PATH, '[]', 'utf-8');
  }
}

function leerTareas(): Tarea[] {
  asegurarArchivo();
  const data = fs.readFileSync(DATA_PATH, 'utf-8');
  return JSON.parse(data) as Tarea[];
}

function guardarTareas(tareas: Tarea[]) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(tareas, null, 2), 'utf-8');
}

// Obtener todas las tareas
export const getTareas = (): Tarea[] => {
  return leerTareas();
};

// Agregar nueva tarea
export const agregarTarea = (texto: string, tableroId: string): Tarea => {
  const tareas = leerTareas();
  const nueva: Tarea = {
    id: crypto.randomUUID(),
    texto,
    tableroId, // Usar el que viene como parámetro
    completada: false,
  };
  const actualizadas = [...tareas, nueva];
  guardarTareas(actualizadas);
  return nueva;
};


// Alternar completada
export const toggleTarea = (id: string): Tarea | undefined => {
  const tareas = leerTareas();
  const idx = tareas.findIndex((t) => t.id === id);
  if (idx !== -1) {
    tareas[idx].completada = !tareas[idx].completada;
    guardarTareas(tareas);
    return tareas[idx];
  }
  return undefined;
};

// Borrar una tarea
export const borrarTarea = (id: string): void => {
  const tareas = leerTareas();
  const actualizadas = tareas.filter((t) => t.id !== id);
  guardarTareas(actualizadas);
};

// Limpiar completadas
export const limpiarCompletadas = (): void => {
  const tareas = leerTareas();
  const actualizadas = tareas.filter((t) => !t.completada);
  guardarTareas(actualizadas);
};

// Editar una tarea
export const editarTarea = (id: string, nuevoTexto: string): Tarea | undefined => {
  const tareas = leerTareas();
  const idx = tareas.findIndex((t) => t.id === id);
  if (idx !== -1) {
    tareas[idx].texto = nuevoTexto;
    guardarTareas(tareas);
    return tareas[idx];
  }
  return undefined;
};
