const API_URL = 'http://localhost:3000/api'

// Obtener todas las tareas
export const fetchTodos = async () => {
  const response = await fetch(`${API_URL}/todos/board/board1`);
  if (!response.ok) throw new Error('Error al cargar las tareas');
  return response.json();
};

// Obtener tareas por board
export const getTodosByBoard = async (boardId) => {
  const response = await fetch(`${API_URL}/todos/board/${boardId}`)
  if (!response.ok) throw new Error('Error al obtener las tareas')
  return response.json()
}

// Añadir una nueva tarea
export const createTodo = async (boardId, todoData) => {
  const response = await fetch(`${API_URL}/todos/board/${boardId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(todoData),
  })
  if (!response.ok) throw new Error('Error al crear la tarea')
  return response.json()
}

// Actualizar una tarea
export const updateTodo = async (todoId, todoData) => {
  const response = await fetch(`${API_URL}/todos/${todoId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(todoData),
  })
  if (!response.ok) throw new Error('Error al actualizar la tarea')
  return response.json()
}

// Eliminar una tarea
export const deleteTodo = async (todoId) => {
  const response = await fetch(`${API_URL}/todos/${todoId}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('Error al eliminar la tarea')
  return response.json()
}

// Eliminar todas las tareas completadas
export const deleteCompletedTodos = async (completedIds) => {
  if (!completedIds?.length) return;
  return Promise.all(completedIds.map(id => deleteTodo(id)));
};
