import { eliminarTareasPorTablero } from './tareas';  

type Tablero = {
  id: number;
  nombre: string;
};

let tableros: Tablero[] = [
  { id: 0, nombre: "Profesional" },
  { id: 1, nombre: "Personal" },
  { id: 2, nombre: "Messi" },
];

// Obtener todos los tableros
export function obtenerTableros(): Tablero[] {
  return tableros;
}

// Guardar todos los tableros (reemplaza la lista completa)
export function guardarTableros(nuevosTableros: Tablero[]): void {
  tableros = nuevosTableros;
}

// Obtener un tablero por ID
export function obtenerTablero(id: number): Tablero | undefined {
  return tableros.find((tablero) => tablero.id === id);
}

// Agregar un nuevo tablero
export function agregarTablero(nombre: string): Tablero {
  const nuevoTablero: Tablero = {
    id: Date.now(),
    nombre,
  };
  tableros.push(nuevoTablero);
  return nuevoTablero;
}

// Editar el nombre de un tablero existente
// export function editarTablero(id: number, nuevoNombre: string): Tablero | null {
//   const index = tableros.findIndex((t) => t.id === id);
//   if (index === -1) {
//     return null;
//   }
//   tableros[index].nombre = nuevoNombre;
//   return tableros[index];
// }

// Eliminar un tablero por ID
export function eliminarTablero(id: number): boolean {
  const index = tableros.findIndex((tablero) => tablero.id === id);
  if (index === -1) {
    return false;
  }

  // Eliminar las tareas asociadas al tablero
  eliminarTareasPorTablero(id);

  // Eliminar el tablero
  tableros.splice(index, 1);
  return true;
}
