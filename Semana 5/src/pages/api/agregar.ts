import type { APIRoute } from "astro";
import { tasks } from "../../lib/tasks.ts";

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  const text = formData.get("task");

  if (typeof text === "string" && text.trim() !== "") {
    tasks.push({ text: text.trim(), done: false });
  }

  return redirect("/");
};
