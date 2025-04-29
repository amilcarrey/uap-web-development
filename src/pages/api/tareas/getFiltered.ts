import type { APIRoute } from 'astro';
import { obtenerFiltrado } from '../../../utils/tareas';

export const GET: APIRoute = async ({ request }) => {
    const url = new URL(request.url);
    const filtro = (url.searchParams.get('filter') || 'all') as 'all' | 'complete' | 'incomplete';  
    const tareasFiltradas = obtenerFiltrado(filtro);
  
    return new Response(JSON.stringify(tareasFiltradas), {
      headers: { 'Content-Type': 'application/json' }
    });
  };
  