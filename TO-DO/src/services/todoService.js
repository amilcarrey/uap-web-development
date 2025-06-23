const API_URL = 'http://localhost:3000/api/todos';

// Obtener todas las tareas
export const fetchTodos = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Error al cargar las tareas');
  return response.json();
};

// Añadir una nueva tarea
export const addTodo = async (text, category = 'personal') => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, category })
  });
  if (!response.ok) throw new Error('Error al crear la tarea');
  return response.json();
};

// Actualizar una tarea
export const updateTodo = async (id, updates) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  if (!response.ok) throw new Error('Error al actualizar la tarea');
  return response.json();
};

// Eliminar una tarea
export const deleteTodo = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Error al eliminar la tarea');
  return response.json();
};

// Eliminar todas las tareas completadas
export const deleteCompletedTodos = async (completedIds) => {
  if (!completedIds?.length) return;
  return Promise.all(completedIds.map(id => deleteTodo(id)));
};
