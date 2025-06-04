import type { APIRoute } from 'astro';
import { obtenerFiltrado } from '../../../utils/tareas';

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const filtro = (url.searchParams.get('filter') || 'all') as 'all' | 'complete' | 'incomplete';

  // Parámetros de paginación:
  const pageParam = url.searchParams.get('page') || '1';
  const limitParam = url.searchParams.get('limit') || '5';

  const page = parseInt(pageParam, 10);
  const limit = parseInt(limitParam, 10);

  const tableroIdParam = url.searchParams.get('tableroId');
  const tableroId = tableroIdParam ? parseInt(tableroIdParam, 10) : null;

  if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
    return new Response(
      JSON.stringify({ error: 'Parámetros de paginación inválidos' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (tableroIdParam && isNaN(tableroId!)) {
    return new Response(
      JSON.stringify({ error: 'tableroId inválido' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Obtener todas las tareas filtradas por estado:
  let tareasFiltradas = obtenerFiltrado(filtro);

  if (!Array.isArray(tareasFiltradas)) {
    console.error('ERROR: obtenerFiltrado() NO devolvió un array', tareasFiltradas);
    return new Response(
      JSON.stringify({ error: 'Error interno: obtenerFiltrado() no devolvió un array' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Filtrar por tableroId si se proporcionó:
  if (tableroId !== null) {
    tareasFiltradas = tareasFiltradas.filter(tarea => tarea.tableroId === tableroId);
  }

  // Calcular la paginación:
  const total = tareasFiltradas.length;
  const totalPages = Math.max(Math.ceil(total / limit), 1); // Al menos 1 página
  const currentPage = Math.min(page, totalPages);

  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;

  const tareasPaginadas = tareasFiltradas.slice(startIndex, endIndex);

  const response = {
    total,
    totalPages,
    page: currentPage,
    limit,
    data: tareasPaginadas,
  };

  console.log('Tareas paginadas:', response);

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
