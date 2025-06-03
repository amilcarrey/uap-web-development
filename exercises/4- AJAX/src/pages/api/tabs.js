import { state } from '../../state.js';

export const prerender = false;

export async function GET() {
  return new Response(JSON.stringify({ 
    tabs: state.tabs,
    activeTab: state.activeTab 
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function POST({ request }) {
  const data = await request.json();
  const { name } = data;
  
  if (!name || name.trim() === '') {
    return new Response(JSON.stringify({ error: 'Tab name is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  const tabId = name.toLowerCase().replace(/\s+/g, '-');
  
  // Verificar si ya existe
  if (state.tabs.includes(tabId)) {
    return new Response(JSON.stringify({ error: 'Tab already exists' }), {
      status: 409,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Agregar pestaña
  state.tabs.push(tabId);
  state.tasks[tabId] = [];
  state.activeTab = tabId;
  
  return new Response(JSON.stringify({ tab: tabId }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function PUT({ request }) {
  const data = await request.json();
  const { tab } = data;
  
  if (!tab || !state.tabs.includes(tab)) {
    return new Response(JSON.stringify({ error: 'Invalid tab' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  state.activeTab = tab;
  
  return new Response(JSON.stringify({ activeTab: tab }), {
    headers: { 'Content-Type': 'application/json' }
  });
}