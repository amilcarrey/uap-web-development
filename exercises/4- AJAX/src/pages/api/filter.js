import { state } from '../../state.js';

export const prerender = false;

export async function GET() {
  return new Response(JSON.stringify({ 
    filter: state.filter 
  }), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export async function PUT({ request }) {
  const data = await request.json();
  const { filter } = data;
  
  const validFilters = ['all', 'complete', 'incomplete'];
  
  if (!filter || !validFilters.includes(filter)) {
    return new Response(JSON.stringify({ error: 'Invalid filter' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  
  // Change filter
  state.filter = filter;
  
  return new Response(JSON.stringify({ 
    filter: state.filter 
  }), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}