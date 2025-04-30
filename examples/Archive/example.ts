import type { APIRoute } from "astro";

let message = "Hello, world!";

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({ message }), {
    headers: { "Content-Type": "application/json" },
  });
};

export const POST: APIRoute = async ({ request }) => {
  const data = await request.json();
  message = data.message;
  return new Response(JSON.stringify({ message }), {
    headers: { "Content-Type": "application/json" },
  });
};
