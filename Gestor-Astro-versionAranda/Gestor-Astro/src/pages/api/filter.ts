import type { APIRoute } from "astro";
import { remindersState } from "../../state";

//Hacer un eventlistener, despues hacer fetch a la api y filtrar los recordatorios?? not sure
type Reminder = {
  id: string;
  text: string;
  completed: boolean;
};

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const filter = url.searchParams.get("filter") || 'all';
  
  // Cargar los recordatorios actuales
  const { reminders } = await remindersState.loadState();
  
  // Aplicar el filtro
  const filteredReminders = filter === 'completed' 
    ? reminders.filter(r => r.completed)
    : filter === 'incomplete'
      ? reminders.filter(r => !r.completed)
      : reminders;

  return new Response(JSON.stringify({
    reminders: filteredReminders,
    filter
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};