import type { APIRoute } from "astro";
import { clearCompletedTasks } from "../../lib/tasks";

export const POST: APIRoute = async ({ request }) => {
    const data = await request.formData();
    const clear = data.get("clearCompleted")?.toString();
  
    if (clear) {
      clearCompletedTasks();
    }
  
    return new Response(null, {
      status: 303,
      headers: { Location: "/" },
    });
  };