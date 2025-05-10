import type { APIRoute } from "astro";
import { clearCompletedTasks } from "../../lib/tasks";

export const POST: APIRoute = async ({ request }) => {
    const contentType = request.headers.get("Content-Type") || "";

    if (contentType.includes("application/json")){
      const data = await request.json();
            if (data.action === "clearCompleted" && data !="") {
                  clearCompletedTasks(); 
                  return new Response(JSON.stringify({success: true}), {
                      headers: {
                        "Content-Type": "application/json"
                      }
                    });
                  }
                  return new Response(
                    JSON.stringify({ error: "Tarea no encontrada" }),
                    { status: 400, headers: { "Content-Type": "application/json" } }
                  );
    }
    else{
      const data = await request.formData();
      const clear = data.get("clearCompleted")?.toString();
  
      if (clear) {
        clearCompletedTasks();
      }
  
      return new Response(null, {
        status: 303,
        headers: { Location: "/" },
      });
      }
    
  };