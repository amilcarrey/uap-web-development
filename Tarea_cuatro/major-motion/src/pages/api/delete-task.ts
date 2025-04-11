import type { APIRoute } from "astro";
import {deleteTask} from "../../lib/tasks";

export const POST: APIRoute = async ({ request }) => {
    const data = await request.formData();
    const deletedTask = data.get("delete")?.toString();
  
    if (deletedTask) {
      deleteTask(deletedTask);
    }
  
    return new Response(null, {
      status: 303,
      headers: { Location: "/" },
    });
  };