import type { APIRoute } from "astro";
import { state } from "./state";

export const GET: APIRoute = ({ url }) => {
  const filter = url.searchParams.get("filter");
  const page = Number(url.searchParams.get("page") ?? "1");
  const limit = Number(url.searchParams.get("limit") ?? "5");

  let filtered = state.tasks;

  if (filter === "completed") {
    filtered = state.tasks.filter((t) => t.completed);
  } else if (filter === "active") {
    filtered = state.tasks.filter((t) => !t.completed);
  }

  const totalTasks = filtered.length;
  const totalPages = Math.ceil(totalTasks / limit);
  const startIndex = (page - 1) * limit;
  const pagedTasks = filtered.slice(startIndex, startIndex + limit);

  return new Response(
    JSON.stringify({
      tasks: pagedTasks,
      totalPages,
      currentPage: page,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
