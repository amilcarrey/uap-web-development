import type { APIRoute } from "astro";
import { addTask, getTasks } from "../../services/tasks";

export const GET: APIRoute = async ({ url }) => {
  const filter = url.searchParams.get("filter");

  const tasks = await getTasks(filter ?? undefined);

  return new Response(JSON.stringify({ tasks }), { status: 200 });
};

export const POST: APIRoute = async ({ request, redirect }) => {
  const contentType = request.headers.get("content-type");

  const text =
    contentType === "application/json"
      ? await request.json().then((data) => data.text as string)
      : await request
        .formData()
        .then((data) => data.get("text")?.toString());
    
  if (!text) {
    return new Response("Text is required", { status: 400 });
  }

  const task = await addTask(text.toString());

  if (contentType === "application/json") {
    return new Response(JSON.stringify({ succes: true, task}), {
      status: 200,
    });
  }
    
  return redirect("/");
};
