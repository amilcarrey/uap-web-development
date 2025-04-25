import type { APIRoute } from "astro";
import { tasks } from "../../types.ts";

export const POST: APIRoute = async ({ request, redirect }) => {
  const contentType = request.headers.get("content-Type");

  // Filtramos para quedarnos solo con las incompletas
  for (let i = tasks.length - 1; i >= 0; i--) {
    if (tasks[i].done) {
      tasks.splice(i, 1);
    }
  }

  if (contentType === "application/json") {
    return new Response(JSON.stringify(tasks), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  return redirect("/");
};
