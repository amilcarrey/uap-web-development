/**
 * @typedef {Object} TodoItem
 * @property {number} id - Unique identifier for the todo item
 * @property {string} text - Text of the todo item
 * @property {boolean} completed - Whether the todo item is completed
 */

let currentId = 0;
/**
 * Genera un id unico autoincremental para cada nuevo elemento
 * @returns {number} 
 */
export function generateId() {
    return ++currentId; 
}

/**
 * @type {{ todos: TodoItem[] }} // indica el tipo de objetos que almacenara el array todos, propiedad de state
 */
export const state = {
    todos: [], 
};
