import type { APIRoute } from "astro";
import {completeTask} from "../../lib/tasks";

export const POST: APIRoute = async ({ request }) => {
    const data = await request.formData();
    const completedTask = data.get("complete")?.toString();
  
    if (completedTask) {
      completeTask(completedTask);
    }
  
    return new Response(null, {
      status: 303,
      headers: { Location: "/" },
    });
  };