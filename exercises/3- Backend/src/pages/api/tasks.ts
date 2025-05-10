export const prerender = false;
import { APIRoute } from "astro";
import {
  addTask,
  deleteTask,
  toggleTaskCompletion,
  deleteCompletedTasks,
} from "../../lib/tasks";

export const POST: APIRoute = async ({ request }) => {
  const contentType = request.headers.get("content-type") || "";

  let method: string | null = null;
  let text: string | null = null;
  let id: number | null = null;

  if (contentType.includes("application/x-www-form-urlencoded")) {
    const bodyText = await request.text();
    const params = new URLSearchParams(bodyText);
    method = params.get("_method");
    text = params.get("text");
    const rawId = params.get("id");
    console.log("Valor crudo del ID:", rawId);
    id = rawId ? Number(rawId) : null;
    console.log("ID como número:", id);
  } else if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    method = formData.get("_method")?.toString() || null;
    text = formData.get("text")?.toString() || null;
    const rawId = formData.get("id")?.toString();
    console.log("Valor crudo del ID:", rawId);
    id = rawId ? Number(rawId) : null;
    console.log("ID como número:", id);
  } else {
    return new Response("Unsupported Content-Type", { status: 400 });
  }

  // Manejo de métodos
  if (method === "DELETE" && id !== null) {
    deleteTask(id);
  } else if (method === "TOGGLE" && id !== null) {
    toggleTaskCompletion(id);
  } else if (method === "DELETE_COMPLETED") {
    deleteCompletedTasks();
    return new Response(null, { status: 303, headers: { Location: "/" } });
  } else if (text) {
    addTask(text);
  } else {
    return new Response("Bad Request", { status: 400 });
  }

  return new Response(null, {
    status: 302,
    headers: { Location: "/" },
  });
};
