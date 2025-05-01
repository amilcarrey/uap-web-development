// src/pages/api/add-task.js
import { addTask } from '../../lib/tareas.js';  // Corrección en la ruta

export async function POST({ request }) {
  const formData = await request.formData();
  const title = formData.get('title');

  if (title) {
    await addTask(title);  // Llamada a la función que agrega la tarea
  }

  return new Response(null, {
    status: 303,
    headers: { Location: '/' },  // Redirige al usuario después de agregar la tarea
  });
}
