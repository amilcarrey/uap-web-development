import type { APIRoute } from "astro";
import { addTarea, getTareas } from "../../services/tasks";
import { string } from "astro:schema";
import type { Task } from "../../types";

export const GET: APIRoute = async ({ request, redirect }) => {
    const search = new URL(request.url).searchParams.get("search");
    const param = () => {
        if (search == "completas") { return true }
        else if (search == "incompletas") { return false }
        else { return undefined }
    }
    const tasks = getTareas(param());
    return new Response(JSON.stringify({ tasks }), { status: 200 })
}

const parseFromJSON = (json: { content: string }) => {
    return json.content
};




export const POST: APIRoute = async ({ request, params, redirect }) => {
    const contentType = request.headers.get("Content-Type");
    const data: {action: string, content: string} = await request.json();
    const accion = data.action;
    //const content = contentType === "application/json" ? await request.json() : parseFromData(await request.formData());

    if (!accion) return new Response("action is required", ({ status: 400 }));

    if(accion == "borrar-completas")
    {
        const tasks = getTareas(false);
        return new Response(JSON.stringify({ tasks }), { status: 201 });

    }else{
        const tarea = addTarea(data.content);
        return new Response(JSON.stringify({ tarea }), { status: 201 });
    }

    return redirect("/");
}

