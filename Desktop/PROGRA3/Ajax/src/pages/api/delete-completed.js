// src/pages/api/delete-completed.js
import { clearCompleted } from '../../api/tareas.js';

export async function post() {
  clearCompleted(); // Llamamos a la función que limpiará las tareas completadas

  return new Response(null, { status: 302, headers: { Location: '/' } });
}
