import type { APIRoute } from "astro";
import { addTask } from "../../lib/tasks";

export const POST: APIRoute = async ({ request }) => {
    const data = await request.formData();
    const name = data.get("task")?.toString();
  
    if (name) {
      addTask(name);
    }
  
    return new Response(null, {
      status: 303,
      headers: { Location: "/" },
    });
  };