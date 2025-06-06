import type { APIRoute } from "astro";
import { remindersState } from "../../state";

type Reminder = {
  id: string;
  text: string;
  completed: boolean;
};

export const POST: APIRoute = async ({ request }) => {
  try {
    let id: string | undefined;
    let boardId: string | undefined;
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await request.formData();
      id = formData.get("id")?.toString();
      boardId = formData.get("boardId")?.toString();
    } else {
      const jsonData = await request.json();
      id = jsonData.id;
      boardId = jsonData.boardId;
    }

    if (!id || !boardId) {
      return new Response(JSON.stringify({ error: "Faltan ID o boardId" }), {
        status: 400, headers: { "Content-Type": "application/json" }
      });
    }

    // Assuming remindersState is an object with reminders array and a setter
    const state = await remindersState.loadState();
    const updatedReminders = state.reminders.map((reminder: any) =>
      reminder.id === id && reminder.boardId === boardId
        ? { ...reminder, completed: !reminder.completed }
        : reminder
    );
    await remindersState.saveState({ ...state, reminders: updatedReminders });

    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500, headers: { "Content-Type": "application/json" }
    });
  }
};