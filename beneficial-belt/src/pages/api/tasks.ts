import type { APIRoute } from "astro";
import { addTarea, getTareas } from "../../services/tasks";

export const GET: APIRoute = async({request, redirect}) =>
{
    const search = new URL(request.url).searchParams.get("search");
    const param = () =>
    {
        if(search == "completas") {return true} 
        else if(search == "incompletas") {return false}
        else{ return undefined}
    }
    const tasks = getTareas(param());
    return new Response( JSON.stringify({tasks}), {status: 200})
}
 
const parseFromJSON = (json: { content: string }) => {
    return json.content
};

const parseFromData = (formData: FormData) => {
    const content = formData.get("content")?.toString()
    return content
};


export const POST: APIRoute = async ({ request, params, redirect }) => {
    const contentType = request.headers.get("Content-Type");

    const content = contentType === "application/json" ? parseFromJSON(await request.json()) : parseFromData(await request.formData());

    if(!content) return new Response("Content is required", ({status: 400}));

    const tarea = addTarea(content);

    if(contentType === "application/json")
    {
        return new Response(JSON.stringify({tarea}), {status: 201});
    }

    return redirect("/");
}

