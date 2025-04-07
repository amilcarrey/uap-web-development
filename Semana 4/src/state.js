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
 * @type {{ tasks: Task[] }} 
 */
export const state = {
  tasks: [],
};

let nextId = 1;

export function generateId() {
  return String(nextId++);
}


// export function addTask(text, generateId) {
//   state.tasks.push({
//     id: generateId(),
//     text,
//     done: false,
//   });
// }

// export function toggleTask(id) {
//   const task = state.tasks.find(t => t.id === id);
//   if (task) {
//     task.done = !task.done;
//   }
// }

// export function deleteTask(id) {
//   state.tasks = state.tasks.filter(t => t.id !== id);
// }

// export function clearCompleted() {
//   state.tasks = state.tasks.filter(t => !t.done);
// }
