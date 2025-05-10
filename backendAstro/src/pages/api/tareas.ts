import type { APIRoute } from "astro";
import {
  agregarTarea,
  borrarTarea,
  toggleTarea,
  limpiarCompletadas,
} from "../../pages/lib/tareas";

export const POST: APIRoute = async ({ request, redirect }) => {
  const data = await request.formData();
  const accion = data.get("accion");

  if (accion === "agregar") {
    const texto = data.get("texto")?.toString();
    if (texto) agregarTarea(texto);
  }

  if (accion === "borrar") {
    const id = Number(data.get("id"));
    borrarTarea(id);
  }

  if (accion === "toggle") {
    const id = Number(data.get("id"));
    toggleTarea(id);
  }

  if (accion === "limpiar") {
    limpiarCompletadas();
  }

  return redirect("/", 303);
};
