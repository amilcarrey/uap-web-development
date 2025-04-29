import type { APIRoute } from "astro";
import {deleteTask} from "../../lib/tasks";

export const POST: APIRoute = async ({ request }) => {
    const contentType = request.headers.get("Content-Type") || "";

    if (contentType.includes("application/json")){
      const data = await request.json();
      if (data.action === "delete" && data.id) {
            const deletedTask = deleteTask(data.id); 
            console.log(deletedTask)
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
            const deletedTask = data.get("delete")?.toString();
            if (deletedTask) {
              deleteTask(deletedTask);
            }
                
            return new Response(null, {
                status: 303,
                headers: { Location: "/" },
            });

          }  
  };


    