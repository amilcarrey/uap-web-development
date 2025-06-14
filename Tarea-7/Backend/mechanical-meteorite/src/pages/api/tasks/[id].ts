import type { APIRoute } from "astro";
import { updateTask, deleteTask } from "../../../db/tasks";

export const PATCH: APIRoute = async ({ params, request }) => {
  const id = params.id!;
  try {
    const { completed } = await request.json();
    const updated = updateTask(id, completed);
    if (!updated) {
      return new Response(JSON.stringify({ error: "Tarea no encontrada" }), {
        status: 404
      });
    }

    return new Response(JSON.stringify(updated), {
      headers: { "Content-Type": "application/json" }
    });
  } catch {
    return new Response(JSON.stringify({ error: "Error al actualizar" }), {
      status: 400
    });
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  const id = params.id!;
  deleteTask(id);
  return new Response(null, { status: 204 });
};
