//src\api\tasks\GET.ts
import type { APIRoute } from 'astro';
import { getFilteredTasks } from '@lib/taskService';

export const GET: APIRoute = async ({ url }) => {
  // Obtener parámetros de consulta
  const tab = url.searchParams.get('tab') || 'personal';
  const filter = url.searchParams.get('filter') || 'all';

  try {
    const tasks = await getFilteredTasks(tab, filter);
    
    return new Response(JSON.stringify({
      success: true,
      tasks,
      currentTab: tab,
      currentFilter: filter
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
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