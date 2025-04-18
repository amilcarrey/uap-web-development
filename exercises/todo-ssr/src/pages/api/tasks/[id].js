import { state } from '../../../state.js';

export const prerender = false;

// Encontrar tarea por ID en cualquier pestaña
function findTask(id) {
  for (const tab in state.tasks) {
    const taskIndex = state.tasks[tab].findIndex(t => t.id === id);
    if (taskIndex !== -1) {
      return { task: state.tasks[tab][taskIndex], tab, index: taskIndex };
    }
  }
  return { task: null, tab: null, index: -1 };
}

export async function PUT({ params, request }) {
  const id = parseInt(params.id);
  const { task, tab, index } = findTask(id);
  
  if (!task) {
    return new Response(JSON.stringify({ error: 'Task not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  const data = await request.json();
  
  // Actualizar propiedades
  if (data.text !== undefined) task.text = data.text;
  if (data.completed !== undefined) task.completed = data.completed;
  
  return new Response(JSON.stringify({ task }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function DELETE({ params }) {
  const id = parseInt(params.id);
  const { task, tab, index } = findTask(id);
  
  if (!task) {
    return new Response(JSON.stringify({ error: 'Task not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Eliminar tarea
  state.tasks[tab].splice(index, 1);
  
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  });
}