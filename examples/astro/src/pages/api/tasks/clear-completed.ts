import { clearCompleted, getTasks } from "../../../services/Tareas";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, redirect }) => {
  const contentType = request.headers.get("content-type") || "";
  clearCompleted();

  if (contentType.includes("application/x-www-form-urlencoded")) {
    return redirect("/", 302);
  }

  const tasks = getTasks("all");
  return new Response(JSON.stringify({ success: true, tasks }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};
