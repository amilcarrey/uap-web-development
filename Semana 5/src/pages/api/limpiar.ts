import type { APIRoute } from "astro";
import { tasks } from "../../lib/tasks.ts";

export const POST: APIRoute = async ({ redirect }) => {
  // Filtramos para quedarnos solo con las incompletas
  for (let i = tasks.length - 1; i >= 0; i--) {
    if (tasks[i].done) {
      tasks.splice(i, 1);
    }
  }

  return redirect("/");
};
