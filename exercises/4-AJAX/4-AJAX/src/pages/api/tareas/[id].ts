//src/pages/api/tareas/[id].ts

import type { APIRoute } from "astro";
import { completarTarea , eliminarTarea} from "../../../services/tareas";
import type { Tarea } from "../../../types";

type Action = "toggle" | "delete" //toggle para completar y descompletar

const parseFromJSON = (data: {action?: Action}) =>{
    return data.action;
}

const parseFromFormData = (formData: FormData) => {
    return formData.get("action")?.toString() as Action | undefined;
}


export const POST: APIRoute = async ({ request, params, redirect }) => {
    const { id } = params;
    const contentType = request.headers.get("content-type");
  
    const action =
      contentType === "application/json"
        ? parseFromJSON(await request.json())
        : parseFromFormData(await request.formData());
  
    if (!action) {
      return new Response("no llegó action [id].ts", { status: 400 });
    }
  
    if (!id) {
      return new Response("no llegó id [id].ts", { status: 404 });
    }
  
    let tarea: Tarea | undefined;
  
    try {
      if (action === "toggle") {

        tarea = completarTarea(id);

      } 
      else if (action === "delete") {

        const ok = eliminarTarea(id);

        if (!ok) return new Response("Tarea no encontrada [id].ts", { status: 404 });

        return contentType === "application/json"
          ? new Response(JSON.stringify({ success: true }), { status: 200 })
          : redirect("/");
      }

    } catch {
      return new Response("Error interno", { status: 500 });
    }
  
    if (contentType === "application/json") {
      return new Response(JSON.stringify({ success: true, tarea }), {
        status: 200,
      });
    }
  
    return redirect("/");
  };