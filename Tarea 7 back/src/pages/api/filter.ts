// src/pages/api/filter.ts
import type { APIRoute } from "astro";
import { remindersState } from "../../state";

type Reminder = {
  id: string;
  text: string;
  completed: boolean;
  boardId: string; // Nuevo
};


export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);

  const boardId = url.searchParams.get("boardId");
  const filter = url.searchParams.get("filter") || "all";
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = parseInt(url.searchParams.get("limit") || "5", 10);

  const { reminders } = await remindersState.loadState();

  // Si no se proporciona boardId, devolver error
  if (!boardId) {
    return new Response(JSON.stringify({ error: "Missing boardId" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 1. Filtrar por boardId
  let filtered = reminders.filter((r) => r.boardId === boardId);

  // 2. Aplicar filtro por estado
  if (filter === "completed") {
    filtered = filtered.filter((r) => r.completed);
  } else if (filter === "incomplete") {
    filtered = filtered.filter((r) => !r.completed);
  }

  // 3. Calcular paginación
  const total = filtered.length;
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  return new Response(
    JSON.stringify({
      reminders: paginated,
      total,
      page,
      limit,
      filter,
      boardId,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
};
