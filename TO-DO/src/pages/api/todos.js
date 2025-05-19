export const prerender = false;

let todos = [
];

// Función para validar la estructura de un todo
function isValidTodo(todo) {
  return (
    todo &&
    typeof todo.text === 'string' && 
    todo.text.trim() !== '' && 
    (!todo.category || typeof todo.category === 'string') &&
    (todo.completed === undefined || typeof todo.completed === 'boolean')
  );
}

export async function GET() {
  return new Response(JSON.stringify(todos), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export async function POST({ request }) {
  try {
    const body = await request.json();
    
    // Validar datos de entrada
    if (!isValidTodo(body)) {
      return new Response(
        JSON.stringify({ 
          error: 'Datos inválidos. Se requiere una propiedad text no vacía.' 
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    // Crear nueva tarea
    const newTodo = {
      id: Date.now().toString(),
      text: body.text.trim(),
      category: body.category || 'personal',
      completed: body.completed !== undefined ? body.completed : false
    };
    
    todos.push(newTodo);
    
    return new Response(JSON.stringify(newTodo), {
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error en POST /api/todos:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Error al procesar la solicitud', 
        details: error.message 
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}

// Exportamos todos para que pueda ser usado por [id].js
export { todos };
