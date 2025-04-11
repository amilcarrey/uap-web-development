import type { APIRoute } from "astro";
import {
  agregarTarea,
  borrarTarea,
  toggleTarea,
  limpiarCompletadas,
} from "../lib/tareas"; // Asegurate que este path esté bien

export const POST: APIRoute = async ({ request, redirect }) => {
  const contentType = request.headers.get("content-type") || "";

  let accion = "";
  let texto = "";
  let id: number | null = null;

  if (contentType.includes("application/json")) {
    // 📦 Viene de fetch con JSON
    const data = await request.json();
    accion = data.accion;
    texto = data.texto;
    id = data.id ?? null;
  } else {
    // 📦 Viene de un formulario HTML (formData)
    const data = await request.formData();
    accion = data.get("accion")?.toString() ?? "";
    texto = data.get("texto")?.toString() ?? "";
    id = data.get("id") ? Number(data.get("id")) : null;
  }

  // 🧠 Lógica de tareas
  if (accion === "agregar" && texto) agregarTarea(texto);
  if (accion === "borrar" && id !== null) borrarTarea(id);
  if (accion === "toggle" && id !== null) toggleTarea(id);
  if (accion === "limpiar") limpiarCompletadas();

  // 🔁 Si vino desde un formulario clásico, redirigimos
  if (!contentType.includes("application/json")) {
    return redirect("/", 303);
  }

  // ⚡ Si vino desde fetch con JSON, devolvemos respuesta directa
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
};
