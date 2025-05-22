import type { APIRoute } from "astro";
import db from "../../db";

export const POST: APIRoute = async ({ redirect }) => {
  db.prepare("DELETE FROM tareas WHERE completada = 1").run();
  return redirect("/tareas");
};