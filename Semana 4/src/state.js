/**
 * Representa el estado global de tareas
 * @typedef {Object} Task
 * @property {string} id - ID único de la tarea
 * @property {string} text - Texto de la tarea
 * @property {boolean} done - Estado de completitud
 *
 * @typedef {Object} TaskState
 * @property {Task[]} tasks - Lista de tareas
 */

/** 
 * Estado global que contiene la lista de tareas
 * @type {{ tasks: Task[] }} 
 */
export const state = {
  tasks: [], // Lista de tareas (cada tarea tiene id, texto y estado done)
};

// Contador interno que se usa para generar IDs únicos
let nextId = 1;

// Funcion que genera un ID único para cada tarea
// Cada vez que se llama, incrementa el contador y devuelve el nuevo ID como string
// Esto asegura que cada tarea tenga un ID único
export function generateId() {
  return String(nextId++); // Convierte el numero a string y luego incrementa el contador
}