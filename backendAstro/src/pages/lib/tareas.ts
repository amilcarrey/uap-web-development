import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export type Task = { id: number; texto: string; completada: boolean };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tareasFile = path.join(__dirname, "../../data/tareas.json");

function leerTareas(): Task[] {
  if (!fs.existsSync(tareasFile)) return [];
  return JSON.parse(fs.readFileSync(tareasFile, "utf-8"));
}

function guardarTareas(tareas: Task[]) {
  fs.writeFileSync(tareasFile, JSON.stringify(tareas, null, 2), "utf-8");
}

export function agregarTarea(texto: string): Task {
  if (!texto.trim()) {
    throw new Error("El texto de la tarea no puede estar vacío.");
  }
  const tareas = leerTareas();
  const nueva = { id: Date.now(), texto, completada: false };
  tareas.push(nueva);
  guardarTareas(tareas);
  return nueva;
}


export function getTareas(): Task[] {
  return leerTareas();
}

export function borrarTarea(id: number) {
  const tareas = leerTareas();
  const nuevasTareas = tareas.filter((tarea) => tarea.id !== id);
  guardarTareas(nuevasTareas);
}

export function toggleTarea(id: number) {
  const tareas = leerTareas();
  const tarea = tareas.find((tarea) => tarea.id === id);
  if (!tarea) return false;
  tarea.completada = !tarea.completada;
  guardarTareas(tareas);
  return true;
}


export function limpiarCompletadas() {
  const tareas = leerTareas();
  const nuevasTareas = tareas.filter((tarea) => !tarea.completada);
  guardarTareas(nuevasTareas);
}

export function actualizarTarea(id: number, nuevoTexto: string): boolean {
  const tareas = leerTareas();
  const tarea = tareas.find((t) => t.id === id);
  if (!tarea) return false;
  tarea.texto = nuevoTexto;
  guardarTareas(tareas);
  return true;
}
