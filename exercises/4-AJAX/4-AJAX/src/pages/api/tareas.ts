//pages//api/tareas.ts

import type { APIRoute } from "astro";
import { getTareas, addTarea } from "../../services/tareas";



export const GET: APIRoute = async ({ request }) => {
    const filtro = new URL(request.url).searchParams.get("filter") ?? "TODAS";
    const tareas = getTareas(filtro);
  
    return new Response(JSON.stringify({ tareas }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };

  const parseFormData = (formData : FormData) =>{
    return formData.get("content")?.toString();
  }

  const parseJson = (json : {content: string}) =>{
    return json.content;
  }

  export const POST: APIRoute =async ({request, redirect}) =>{
    const contentType = request.headers.get("content-type");


    const content = contentType === "application/json" ? parseJson(await request.json()) : parseFormData(await request.formData());

    if(!content){
        return new Response("no llegó content", {status:400});
    }

    const tarea = addTarea(content);

    if (contentType === "application/json"){
        return new Response(JSON.stringify({ tarea }), { status: 200 });
    }

    return redirect("/");
  }