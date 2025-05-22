import type { APIRoute } from "astro";
import db from "../../db";

export const POST: APIRoute = async ({ request, redirect }) => {
  const rawBody = await request.text();
  const params = new URLSearchParams(rawBody);
  const texto = params.get("texto");

  if (texto && texto.trim() !== "") {
    db.prepare("INSERT INTO tareas (texto) VALUES (?)").run(texto.trim());
  }

  return redirect("/tareas");
};
