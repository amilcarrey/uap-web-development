import type { APIRoute } from "astro";
import db from "../../db";

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const id = form.get("id")?.toString();

  if (id) {
    db.prepare("DELETE FROM tareas WHERE id = ?").run(id);
  }

  return redirect("/tareas");
};