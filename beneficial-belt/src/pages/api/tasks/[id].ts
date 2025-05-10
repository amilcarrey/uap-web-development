import type { APIRoute } from "astro";
import { checkTarea } from "../../../services/tasks";
import { deleteTarea } from "../../../services/tasks";
import type { Task } from "../../../types";

type Action = "check" | "delete";

const parseFromJSON = (data: { action?: Action }) => {
    return data.action
};

const parseFromData = (formData: FormData) => {
    return formData.get("action")?.toString() as Action | undefined;
};

export const POST: APIRoute = async ({ request, params, redirect }) => {
    const { id } = params;
    const contentType = request.headers.get("Content-Type");

    const action = contentType === "application/json" ? parseFromJSON(await request.json()) : parseFromData(await request.formData());

    if(!action) return new Response("Action is required", ({status: 400}));

    if(!id) return new Response("Id is required", ({status: 404}));

    let tarea : Task | null = null; 

    try{
        if (action == "check"){
            tarea = checkTarea(id);
        } else if (action == "delete"){
            tarea = deleteTarea(id);
        }
    } catch (error)
    {
        return new Response("Error", {status : 404});
    }

    if(contentType === "application/json")
    {
        return new Response(JSON.stringify({succes: true, tarea}), {status: 200});
    }

    return redirect("/");
}

