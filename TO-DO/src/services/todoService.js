const API_URL = '/api/todos';

// Helper para debuggear las respuestas
async function handleResponse(response, errorMessage) {
  if (!response.ok) {
    let errorDetails = '';
    try {
      const errorData = await response.json();
      errorDetails = errorData.error || '';
    } catch (e) {
      // Ignora errores al parsear el cuerpo
    }
    
    console.error(`${errorMessage} Status: ${response.status}. Details: ${errorDetails}`);
    throw new Error(`${errorMessage} (${response.status})${errorDetails ? ': ' + errorDetails : ''}`);
  }
  
  return response.json();
}

// Obtener todas las tareas
export async function fetchTodos() {
  try {
    const response = await fetch(API_URL);
    return handleResponse(response, 'Error en la respuesta del servidor');
  } catch (error) {
    console.error('Error fetching todos:', error);
    
    // Fallback a localStorage si la API falla
    if (typeof localStorage !== 'undefined') {
      const localData = localStorage.getItem('todos');
      if (localData) {
        console.log('Cargando datos del localStorage como fallback');
        return JSON.parse(localData);
      }
    }
    
    throw error;
  }
}

// Añadir una nueva tarea
export async function addTodo(text, category) {
  try {
    if (!text || !text.trim()) {
      throw new Error('El texto de la tarea es requerido');
    }
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        text: text.trim(), 
        category: category || 'personal'
      })
    });
    
    return handleResponse(response, 'Error al crear la tarea');
  } catch (error) {
    console.error('Error adding todo:', error);
    throw error;
  }
}

// Actualizar una tarea existente
export async function updateTodo(id, updates) {
  try {
    if (!id) {
      throw new Error('ID de tarea es requerido');
    }
    
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    });
    
    return handleResponse(response, 'Error al actualizar la tarea');
  } catch (error) {
    console.error('Error updating todo:', error);
    throw error;
  }
}

// Eliminar una tarea
export async function deleteTodo(id) {
  try {
    if (!id) {
      throw new Error('ID de tarea es requerido');
    }
    
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
    
    return handleResponse(response, 'Error al eliminar la tarea');
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
}

// Eliminar todas las tareas completadas
export async function deleteCompletedTodos(completedIds) {
  try {
    if (!completedIds || !Array.isArray(completedIds) || completedIds.length === 0) {
      throw new Error('Se requiere al menos un ID válido para eliminar');
    }
    
    // Crear un array de promesas para eliminar múltiples tareas
    const deletePromises = completedIds.map(id => 
      fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      }).then(response => {
        if (!response.ok) throw new Error(`Error eliminando tarea ${id}`);
        return response.json();
      })
    );
    
    // Ejecutar todas las eliminaciones en paralelo
    return Promise.all(deletePromises);
  } catch (error) {
    console.error('Error deleting completed todos:', error);
    throw error;
  }
}
