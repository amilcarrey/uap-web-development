import type { APIRoute } from 'astro';
import { addTab, deleteTab, renameTab } from '@lib/tabsService';

export const POST: APIRoute = async ({ request }) => {
  let body: any = {};
  try {
    body = await request.json();
    console.log('[DEBUG] POST /api/tabs body:', body); // Debug para ver el cuerpo recibido
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: 'Invalid JSON' }), { status: 400 });
  }
  const action = body.action;

  try {
    switch (action) {
      case 'create': {
        const title = body.title;
        if (!title) {
          return new Response(JSON.stringify({ success: false, error: 'Missing title' }), { status: 400 });
        }
        const newTab = await addTab({ title });
        return new Response(JSON.stringify({ success: true, tab: newTab }), { status: 201 });
      }
      case 'delete': {
        const tabId = body.tabId;
        if (!tabId) {
            console.log("No realizo la eliminacion del tab porque no se envio el id del tab");
          return new Response(JSON.stringify({ success: false, error: 'Missing tabId' }), { status: 400 });
        }
        await deleteTab(tabId);
        return new Response(JSON.stringify({ success: true }), { status: 200 });
      }
      case 'rename': {
        const tabId = body.tabId;
        // Permitir tanto 'title' como 'newTitle' para compatibilidad
        const newTitle = body.title || body.newTitle;
        if (!tabId || !newTitle) {
          return new Response(JSON.stringify({ success: false, error: 'Missing tabId or title' }), { status: 400 });
        }
        const updatedTab = await renameTab(tabId, newTitle);
        if (!updatedTab) {
          return new Response(JSON.stringify({ success: false, error: 'Tab not found' }), { status: 404 });
        }
        return new Response(JSON.stringify({ success: true, tab: updatedTab }), { status: 200 });
      }
      default:
        console.error('[ERROR API /api/tabs/POST]: Invalid action:', action);
        return new Response(JSON.stringify({ success: false, error: 'Invalid action' }), { status: 400 });
    }
  } catch (error) {
    console.error('[ERROR API /api/tabs/POST]:', error);
    return new Response(JSON.stringify({ success: false, error: 'Operation failed' }), { status: 500 });
  }
};
