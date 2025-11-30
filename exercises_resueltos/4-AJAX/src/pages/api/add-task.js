import { addTask } from '../../lib/tasks.js';

export async function POST({ request }) {
  const contentType = request.headers.get('content-type') || '';
  const accept = request.headers.get('accept') || '';
  let description;

  if (contentType.includes('application/json')) {
    const data = await request.json();
    description = data.description;
  } else {
    const formData = await request.formData();
    description = formData.get('description');
  }

  if (!description) {
    return new Response(
      JSON.stringify({ error: "Descripción requerida" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const nuevaTarea = addTask(description);

  if (accept.includes('text/html')) {
    return new Response(null, {
      status: 303,
      headers: { Location: "/" },
    });
  }

  return new Response(JSON.stringify(nuevaTarea), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
