import type { APIRoute } from "astro";
import db from "../../db";

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const id = form.get("id")?.toString();

  if (id) {
    db.prepare("UPDATE tareas SET completada = NOT completada WHERE id = ?").run(id);
  }

  return redirect("/tareas");
};