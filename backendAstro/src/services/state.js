/**
 * @typedef {Object} Task
 * @property {string} texto - El texto de la tarea.
 * @property {boolean} completada - Indica si la tarea está completada.
 */

/**
 * @property {Task[]} tasks - Array de objetos de tareas.
 */

export const state = {
  tasks: [
    { texto: "Comprar pan", completada: false },
    { texto: "Estudiar analisis matemático", completada: false },
  ],
};