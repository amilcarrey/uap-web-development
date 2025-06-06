
import { state } from '../../state';

export async function GET() {
  return new Response(JSON.stringify(state.tasks), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function POST({ request }) {
  const { text } = await request.json();
  const newTask = { id: Date.now(), text, completed: false };
  state.tasks.push(newTask);
  return new Response(JSON.stringify(newTask), {
    status: 201,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function PUT({ request }) {
  const { id, completed } = await request.json();
  const task = state.tasks.find(t => t.id === id);
  if (task) task.completed = completed;
  return new Response(JSON.stringify(task), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function DELETE({ request }) {
  const { id } = await request.json();
  state.tasks = state.tasks.filter(t => t.id !== id);
  return new Response(null, { status: 204 });
}

export async function PATCH({ request }) {

  state.tasks = state.tasks.filter(t => !t.completed);
  return new Response(null, { status: 204 });
}
