export const prerender = false;

// Importar los todos desde el archivo principal
import { todos } from '../todos';

export async function DELETE() {
  try {
    // Identificar tareas completadas
    const completedTodos = todos.filter(todo => todo.completed);
    
    // Si no hay tareas completadas, devolver mensaje
    if (completedTodos.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No hay tareas completadas para eliminar' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const completedIds = completedTodos.map(todo => todo.id);
    const remainingTodos = todos.filter(todo => !todo.completed);
    
    todos.length = 0;
    todos.push(...remainingTodos);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        deleted: completedTodos,
        count: completedTodos.length
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error al eliminar tareas completadas:', error);
    return new Response(
      JSON.stringify({ error: 'Error al procesar la solicitud' }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}
