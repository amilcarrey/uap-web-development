import { state } from "../../state.js";

export const prerender = false;

export async function GET({ url }) {
  try {
    const params = new URLSearchParams(url.search);
    const tab = params.get('tab') || 'today';
    const page = parseInt(params.get('page') || '1');
    const limit = parseInt(params.get('limit') || '5');
    const filter = params.get('filter') || 'all';
    
    let tasks = state.tasks[tab] || [];
    
    if (filter === 'incomplete') {
      tasks = tasks.filter(task => !task.completed);
    } else if (filter === 'complete') {
      tasks = tasks.filter(task => task.completed);
    }

    const totalItems = tasks.length;
    const totalPages = Math.ceil(totalItems / limit);
    const offset = (page - 1) * limit;
    const startItem = totalItems > 0 ? offset + 1 : 0;
    const endItem = totalItems > 0 ? Math.min(offset + limit, totalItems) : 0;
    
    const paginatedTasks = tasks.slice(offset, offset + limit);
    
    const response = {
      tasks: paginatedTasks,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        startItem,
        endItem
      }
    };
    
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
    
  } catch (error) {
    console.error('Error fetching tasks:', error);
    
    const errorResponse = {
      error: 'Failed to fetch tasks',
      tasks: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: 5,
        hasNextPage: false,
        hasPrevPage: false,
        startItem: 0,
        endItem: 0
      }
    };
    
    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

export async function POST({ request }) {
  try {
    const { text, tab } = await request.json();
    
    if (!text || !text.trim()) {
      return new Response(JSON.stringify({ error: 'Text is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (!state.tasks[tab]) {
      state.tasks[tab] = [];
    }
    
    const newTask = {
      id: state.nextId++,
      text: text.trim(),
      completed: false,
      tab: tab || 'today'
    };
    
    state.tasks[tab].push(newTask);
    
    return new Response(JSON.stringify({ task: newTask }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    console.error('Error creating task:', error);
    return new Response(JSON.stringify({ error: 'Failed to create task' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function PUT({ url, request }) {
  try {
    const urlParts = url.pathname.split('/');
    const taskId = parseInt(urlParts[urlParts.length - 1]);
    const updates = await request.json();
    
    let foundTask = null;
    let foundTab = null;
    
    for (const [tabName, tasks] of Object.entries(state.tasks)) {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        foundTask = task;
        foundTab = tabName;
        break;
      }
    }
    
    if (!foundTask) {
      return new Response(JSON.stringify({ error: 'Task not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (updates.text !== undefined) foundTask.text = updates.text;
    if (updates.completed !== undefined) foundTask.completed = updates.completed;
    
    return new Response(JSON.stringify({ task: foundTask }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    console.error('Error updating task:', error);
    return new Response(JSON.stringify({ error: 'Failed to update task' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function DELETE({ url }) {
  try {
    const urlParts = url.pathname.split('/');
    const taskId = parseInt(urlParts[urlParts.length - 1]);
    
    // Buscar y eliminar la tarea en todas las pestañas
    let deleted = false;
    
    for (const [tabName, tasks] of Object.entries(state.tasks)) {
      const taskIndex = tasks.findIndex(t => t.id === taskId);
      if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        deleted = true;
        break;
      }
    }
    
    if (!deleted) {
      return new Response(JSON.stringify({ error: 'Task not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    console.error('Error deleting task:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete task' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}