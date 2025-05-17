import { atom } from 'nanostores';

// Definir la estructura de un ToDo
// { id: string, text: string, category: string, completed: boolean }

// Cargar todos del localStorage si existen
const savedTodos = typeof localStorage !== 'undefined' 
  ? JSON.parse(localStorage.getItem('todos') || '[]') 
  : [];

// Asegurar que todos los todos tienen la propiedad category
const todosWithCategory = savedTodos.map(todo => ({
  ...todo,
  category: todo.category || 'personal' // Añadir categoría por defecto si no existe
}));

export const todos = atom(todosWithCategory);

// Guardar todos en localStorage cada vez que cambien
todos.listen(state => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('todos', JSON.stringify(state));
  }
});

// Añadir un nuevo ToDo
export function addTodo(text, category = 'personal') {
  const newTodo = {
    id: Date.now().toString(),
    text,
    category,
    completed: false
  };
  
  todos.set([...todos.get(), newTodo]);
  return newTodo;
}

// Cambiar el estado de un ToDo (completado/no completado)
export function toggleTodo(id) {
  const updatedTodos = todos.get().map(todo => 
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  
  todos.set(updatedTodos);
  return updatedTodos.find(todo => todo.id === id);
}

// Eliminar un ToDo
export function removeTodo(id) {
  const todoToRemove = todos.get().find(todo => todo.id === id);
  const updatedTodos = todos.get().filter(todo => todo.id !== id);
  todos.set(updatedTodos);
  return todoToRemove;
}

// Eliminar todas las tareas completadas
export function removeCompletedTodos() {
  const completedTodos = todos.get().filter(todo => todo.completed);
  const activeTodos = todos.get().filter(todo => !todo.completed);
  todos.set(activeTodos);
  return completedTodos;
}

// Filtrar todos (all, active, completed) y por categoría
export function filterTodos(filter = 'all', category = 'all') {
  let allTodos = todos.get();
  
  // Filtrar por categoría primero
  if (category !== 'all') {
    allTodos = allTodos.filter(todo => todo.category === category);
  }
  
  // Luego filtrar por estado
  if (filter === 'all') return allTodos;
  if (filter === 'active') return allTodos.filter(todo => !todo.completed);
  if (filter === 'completed') return allTodos.filter(todo => todo.completed);
  
  return allTodos;
}
