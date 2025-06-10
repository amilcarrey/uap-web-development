import type { APIRoute } from "astro";
import { remindersState } from "../../state";

export const POST: APIRoute = async ({ request }) => {
  let id: string | undefined;
  let text: string | undefined;
  let boardId: string | undefined;

  const contentType = request.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    const json = await request.json();
    id = json.id;
    text = json.text;
    boardId = json.boardId;
  } else if (contentType?.includes("application/x-www-form-urlencoded")) {
    const form = await request.formData();
    id = form.get("id")?.toString();
    text = form.get("text")?.toString();
    boardId = form.get("boardId")?.toString();
  }

  if (!id || !boardId || !text || text.trim() === "") {
    return new Response(JSON.stringify({ error: "Faltan datos requeridos" }), {
      status: 400, headers: { "Content-Type": "application/json" }
    });
  }

  const state = await remindersState.loadState();

  const updatedReminders = state.reminders.map((r) => {
    if (r.id === id && r.boardId === boardId) {
      return { ...r, text };
    }
    return r;
  });

  // 🔧 ESTO FALTABA
  state.reminders = updatedReminders;
  await remindersState.saveState(state);

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};

