export const prerender = false;

import { state } from '../../state.js';

export async function POST({ request }) { //extrae los valores del form
  const formData = await request.formData();
  const action = formData.get('action');
  const index = formData.get('index');
  const text = formData.get('nuevaTarea') || formData.get('text');

  let response = { success: false }; //objeto de rta por defecto (fallo inicial

  try {
    switch(action) {
      case 'add': //agreagar tarea
        if (text?.trim()) {
          const newTask = { texto: text.trim(), completada: false };
          state.tareas.push(newTask); //agrega la tarea al array en el estado global
          response = { 
            success: true, 
            task: newTask, //devuelvo la tarea creada y abajo el indice
            index: state.tareas.length - 1
          };
        }
        break;

      case 'toggle':
        const actualIndex = index === "optimistic" //determina indice real 
          ? state.tareas.length - 1 //si es opt usa la ult tarea y sino convierte el indice a numero abajo
          : parseInt(index);

        if (actualIndex !== null && state.tareas[actualIndex]) { //verifica q el indice es valido y q la tarea existe
          state.tareas[actualIndex].completada = !state.tareas[actualIndex].completada;
          response = { 
            success: true, 
            completed: state.tareas[actualIndex].completada,
            index: actualIndex
          };
        }
        break;

      case 'delete': //eliminar tarea
        if (index !== null) {
          state.tareas.splice(index, 1);
          response = { success: true, index: index };
        }
        break;

      case 'clear': //borrar todas las tareas completadas
        const beforeCount = state.tareas.length; //guarda la cant de tareas antes d borrar
        state.tareas = state.tareas.filter(t => !t.completada); //filtra el array y se queda con las no completadas
        response = { 
          success: true,
          cleared: beforeCount - state.tareas.length //cantidad d tareas borradas
        };
        break;
    }
  } catch (error) {
    console.error('API Error:', error);
  }

return new Response(JSON.stringify(response), {
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  }
});

}

export async function GET() {
  return new Response(JSON.stringify({ tareas: state.tareas }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
