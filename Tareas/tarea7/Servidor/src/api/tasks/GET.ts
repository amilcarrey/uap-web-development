// src/api/tasks/GET.ts
//

/*
=====================================
 Endpoint GET para obtener tareas con paginación y filtrado
 =====================================

 Este archivo define el endpoint GET de la API para obtener tareas.
 Permite filtrar por pestaña (tab), estado (filter), y soporta paginación (page, limit).
 Devuelve las tareas filtradas y paginadas, junto con información útil para el frontend.

 Parámetros de consulta soportados:
   - tab: string (ej: 'personal', 'professional')
   - filter: string ('all', 'completed', 'active')
   - page: número de página (por defecto 1)
   - limit: cantidad de tareas por página (por defecto 10)

 Respuesta:
   - success: boolean
   - tasks: array de tareas (solo la página solicitada)
   - total: total de tareas filtradas
   - page: página actual
   - limit: cantidad de tareas por página
   - currentTab: pestaña actual
   - currentFilter: filtro actual
*/
import type { APIRoute } from 'astro';
import { getFilteredTasks } from '@lib/taskService';

/**
 * Handler para el método GET de la API de tareas.
 * Procesa los parámetros de consulta, aplica filtrado y paginación,
 * y devuelve la respuesta en formato JSON.
 */
export const GET: APIRoute = async ({ url }) => {
  
  // 1. Obtener parámetros de consulta (query params)
  const tab = url.searchParams.get('tab') || 'personal';
  const filter = url.searchParams.get('filter') || 'all';
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || '10', 10);

  try {
    // 2. Obtener todas las tareas filtradas según tab y filter
    const tasks = await getFilteredTasks(tab, filter);
    const total = tasks.length; // Total de tareas filtradas

    // 3. Calcular el rango de la página solicitada
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedTasks = tasks.slice(start, end); // Solo las tareas de la página
    
    // 4. Devolver la respuesta con la página de tareas y metadatos
    return new Response(JSON.stringify({
      success: true,
      tasks: paginatedTasks,
      total,
      page,
      limit,
      currentTab: tab,
      currentFilter: filter
    }),{
      status: 200, 
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    // 5. Manejo de errores: loguea y responde con error 500
    console.error("[ERROR API /api/tasks/GET]:", error); // Para depuración
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch tasks'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

/*
====================
EXPLICACIÓN GENERAL
====================
- Este endpoint permite al frontend pedir tareas filtradas y paginadas.
- El filtrado se hace por pestaña (tab) y estado (filter: todas, completadas, activas).
- La paginación se logra con los parámetros page y limit, devolviendo solo una parte del total.
- Así, el frontend puede mostrar páginas de tareas y saber cuántas hay en total para mostrar controles de paginación.
*/