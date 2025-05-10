import type { APIRoute } from "astro";
import { state } from "../../state";


export const GET: APIRoute = async ({ request }) => {
    const url = new URL(request.url, "http://localhost");
    const filter = url.searchParams.get("filter");

    let tasks = state.tareas; // Usa el state global real

    if (filter === "active") {
        tasks = tasks.filter(task => !task.completada);
    } else if (filter === "completed") {
        tasks = tasks.filter(task => task.completada);
    }

    return new Response(JSON.stringify(tasks), {
        headers: { "Content-Type": "application/json" },
    });
};