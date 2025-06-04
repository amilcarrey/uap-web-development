import type { APIRoute } from 'astro';
import { getTabs } from '@lib/tabsService';

export const GET: APIRoute = async ({ request }) => {
  // Si el cliente envía JSON, podrías procesar filtros aquí si lo necesitas
  try {
    const tabs = await getTabs();
    return new Response(JSON.stringify({ success: true, tabs }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Failed to fetch tabs' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
