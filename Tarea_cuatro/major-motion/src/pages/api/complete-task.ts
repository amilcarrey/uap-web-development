import type { APIRoute } from "astro";
import {completeTask} from "../../lib/tasks";


export const POST: APIRoute = async ({ request }) => {
    const contentType = request.headers.get("Content-Type") || "";

    if (contentType.includes("application/json")){
      const data = await request.json();
      if (data.action === "complete" && data.id) {
        const newTask = completeTask(data.id); 
        console.log(newTask)
        
        return new Response(JSON.stringify(newTask), {
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
      const completedTask = data.get("complete")?.toString();
      if (completedTask) {
        completeTask(completedTask);
      }
    
      return new Response(null, {
        status: 303,
        headers: { Location: "/" },
      });

    }
  
    
  };

  