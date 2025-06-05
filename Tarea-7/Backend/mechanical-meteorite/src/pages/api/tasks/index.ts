import type { APIContext } from "astro";
import { getTasks, addTask } from "../../../db/tasks";

export async function GET(context: APIContext) {
  return new Response(JSON.stringify(getTasks()), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST({ request }: APIContext) {
  const data = await request.json();
  const newTask = addTask(data);
  return new Response(JSON.stringify(newTask), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
