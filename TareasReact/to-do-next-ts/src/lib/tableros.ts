import fs from 'fs';
import path from 'path';
import { getTareas } from './tareas';

const TABLEROS_PATH = path.join(process.cwd(), 'data', 'tableros.json');

export type Tablero = {
  id: string;
  nombre: string;
};

// 🔐 Asegura que el archivo exista
function asegurarArchivoTableros() {
  if (!fs.existsSync(TABLEROS_PATH)) {
    fs.mkdirSync(path.dirname(TABLEROS_PATH), { recursive: true });
    fs.writeFileSync(TABLEROS_PATH, '[]', 'utf-8');
  }
}

// 📖 Leer todos los tableros
export function leerTableros(): Tablero[] {
  asegurarArchivoTableros();
  const data = fs.readFileSync(TABLEROS_PATH, 'utf-8');
  return JSON.parse(data);
}

// 💾 Guardar lista completa
export function guardarTableros(tableros: Tablero[]) {
  fs.writeFileSync(TABLEROS_PATH, JSON.stringify(tableros, null, 2), 'utf-8');
}

// 🆕 Crear tablero (con opción a forzar ID)
export function crearTablero(nombre: string, idForzado?: string): Tablero {
  const tableros = leerTableros();
  const nuevo = { id: idForzado || crypto.randomUUID(), nombre };
  guardarTableros([...tableros, nuevo]);
  return nuevo;
}

// 🗑 Eliminar tablero
export function eliminarTablero(id: string) {
  const tableros = leerTableros().filter(t => t.id !== id);
  guardarTableros(tableros);
}

// 🔍 Leer tablero con tareas asociadas (para /api/tableros/[id])
export function leerTableroPorId(id: string) {
  const tablero = leerTableros().find((t) => t.id === id);
  if (!tablero) return null;
  const tareas = getTareas().filter((t) => t.tableroId === id);
  return { ...tablero, tareas };
}
