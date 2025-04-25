import type { APIRoute } from "astro";
import { getTareas } from "../../lib/tareas";

export const GET: APIRoute = async ({ url }) => {
  console.log("📥 /api/tareas-data.ts fue llamado");

  const filtro = url.searchParams.get("filtro") || "todas";

  const tareas = getTareas().filter((t) =>
    filtro === "completas" ? t.completada :
    filtro === "incompletas" ? !t.completada :
    true
  );

  return new Response(JSON.stringify(tareas), {
    headers: { "Content-Type": "application/json" },
  });
};
