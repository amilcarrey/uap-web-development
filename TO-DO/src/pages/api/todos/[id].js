export const prerender = false;

// Referencia a los todos desde el archivo principal
import { todos } from '../todos';

function isValidId(id) {
  return id && typeof id === 'string' && id.trim() !== '';
}

function findTodoById(id) {
  return todos.find(todo => todo.id === id);
}

export async function GET({ params }) {
  try {
    const { id } = params;
    
    if (!isValidId(id)) {
      return new Response(
        JSON.stringify({ error: 'ID inválido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const todo = findTodoById(id);
    
    if (!todo) {
      return new Response(
        JSON.stringify({ error: 'Tarea no encontrada' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify(todo),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error(`Error en GET /api/todos/${params.id}:`, error);
    
    return new Response(
      JSON.stringify({ error: 'Error al procesar la solicitud' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function PUT({ params, request }) {
  try {
    const { id } = params;
    
    if (!isValidId(id)) {
      return new Response(
        JSON.stringify({ error: 'ID inválido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Buscar la tarea
    const todoIndex = todos.findIndex(t => t.id === id);
    
    if (todoIndex === -1) {
      return new Response(
        JSON.stringify({ error: 'Tarea no encontrada' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Obtener y validar el cuerpo de la solicitud
    const updates = await request.json();
    
    // Actualizar solo los campos permitidos
    const updatedTodo = {
      ...todos[todoIndex],
      ...(updates.text && { text: updates.text }),
      ...(updates.category && { category: updates.category }),
      ...(updates.completed !== undefined && { completed: Boolean(updates.completed) })
    };
    
    todos[todoIndex] = updatedTodo;
    
    return new Response(
      JSON.stringify(updatedTodo),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error(`Error en PUT /api/todos/${params.id}:`, error);
    
    return new Response(
      JSON.stringify({ error: 'Error al actualizar la tarea' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function DELETE({ params }) {
  try {
    const { id } = params;
    
    if (!isValidId(id)) {
      return new Response(
        JSON.stringify({ error: 'ID inválido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const todoIndex = todos.findIndex(t => t.id === id);
    
    if (todoIndex === -1) {
      return new Response(
        JSON.stringify({ error: 'Tarea no encontrada' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const deletedTodo = todos[todoIndex];
    todos.splice(todoIndex, 1);
    
    return new Response(
      JSON.stringify({ success: true, deleted: deletedTodo }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error(`Error en DELETE /api/todos/${params.id}:`, error);
    
    return new Response(
      JSON.stringify({ error: 'Error al eliminar la tarea' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
