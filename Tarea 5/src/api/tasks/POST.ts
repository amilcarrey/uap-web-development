//src\api\tasks\POST.ts
import type { APIRoute } from 'astro';
import { addTask, toggleTask, clearCompleted, deleteTask } from '@lib/taskService';

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const action = formData.get('action');
  const tabId = formData.get('tabId')?.toString() || 'personal';

  const accept = request.headers.get('accept') || '';
  const isJson = accept.includes('application/json');

  try {
    switch (action) {
      case 'add':
        const text = formData.get('text') as string;
        if (!text || typeof text !== 'string') {
          return new Response(JSON.stringify({ error: 'Missing or invalid text' }), {
            status: 400,
          });
        }
        
        const newTask = await addTask({
          text,
          completed: false,
          tabId
        });

        //return isJson ? new Response(JSON.stringify({ success: true }), { status: 201 }) : Response.redirect(new URL('/', request.url), 303);
        return isJson ? new Response(JSON.stringify(newTask), { status: 201 }) : Response.redirect(new URL('/', request.url), 303);
        /*Si la peticion viene del navegador entonces se redirige automaticamente a la pagina principal, y 
          Astro la vuelve a renderizar con las tareas actualizadas
        */
       
      case 'toggle':
        await toggleTask(formData.get('taskId') as string);

        return isJson ? new Response(JSON.stringify({ success: true })) : Response.redirect(new URL('/', request.url), 303);
      
      case 'clear-completed':
        await clearCompleted(tabId);

        return isJson ? new Response(JSON.stringify({ success: true })) : Response.redirect(new URL('/', request.url), 303);
      
      case 'delete':
        const taskId = formData.get('taskId')?.toString();
        if (!taskId) {
          return new Response(JSON.stringify({ error: 'Missing taskId' }), {
            status: 400,
          });
        }

        await deleteTask(taskId);

        return isJson ? new Response(JSON.stringify({ success: true })) : Response.redirect(new URL('/', request.url), 303);
      
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), { 
          status: 400 
        });
    }
  } catch (error) {
    console.error('[ERROR API /api/tasks]:', error);
    return new Response(JSON.stringify({ error: 'Operation failed' }), { 
      status: 500 
    });
  }
};