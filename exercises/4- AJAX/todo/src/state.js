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

/**
 * Agrega una nueva tarea
 * @param {string} text
 * @returns {TodoItem}
 */
export function addTodo(text) {
    const newTodo = {
        id: generateId(),
        text,
        completed: false,
    };
    state.todos.push(newTodo);
    return newTodo;
  }
  
  /**
   * Alterna el estado de completado de una tarea
   * @param {number} id
   */
export function toggleTodo(id) {
    const todo = state.todos.find((t) => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
    }
}

/**
   * Elimina una tarea por ID
   * @param {number} id
   */
export function deleteTodo(id) {
    state.todos = state.todos.filter((t) => t.id !== id);
}
  
/**
   * Elimina todas las tareas completadas
*/
export function clearCompletedTodos() {
    state.todos = state.todos.filter((t) => !t.completed);
}

/**
 * Obtiene las tareas filtradas por estado
 * @param {string} filter - Puede ser 'all', 'uncompleted' o 'completed'
 * @return {todos: TodoItem[]}
 * */
export function getFilteredTodos(filter) {
    switch (filter) {
        case 'all':
            return state.todos;
        case 'uncompleted':
            return state.todos.filter((t) => !t.completed);
        case 'completed':
            return state.todos.filter((t) => t.completed);
        default:
            return state.todos;
    }
}
