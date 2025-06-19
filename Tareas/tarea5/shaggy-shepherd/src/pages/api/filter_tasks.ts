// src/pages/api/filter_tasks.ts
import type { APIRoute } from "astro";
import { tasks } from "../../server/tasks"; // or wherever you store them


export const GET: APIRoute = async ({ url }) => {
  const filter = url.searchParams.get("filter");

  let filteredTasks = tasks;
  if (filter === "completed") {
    filteredTasks = tasks.filter(task => task.completed);
  } else if (filter === "incomplete") {
    filteredTasks = tasks.filter(task => !task.completed);
  }

  return new Response(
    JSON.stringify({ tasks: filteredTasks }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};
