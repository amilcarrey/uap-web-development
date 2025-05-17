import { readTasks } from './tareas.js';

export async function GET({ url }) {
  // Obtener el filtro de los parámetros de la URL
  const filter = url.searchParams.get('filter') || 'all';

  // Leer las tareas desde el archivo
  const tasks = readTasks();

  // Filtrar las tareas según el valor de 'filter'
  const filtered = tasks.filter(task =>
    filter === 'all' || // Mostrar todas las tareas
    (filter === 'completed' && task.completed) || // Mostrar solo las completadas
    (filter === 'pending' && !task.completed) // Mostrar solo las pendientes
  );

  // Devolver las tareas filtradas en formato JSON
  return new Response(JSON.stringify(filtered), {
    headers: { 'Content-Type': 'application/json' }
  });
}
