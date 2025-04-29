import { state } from "../state";

export async function POST({ request }: { request: Request }) {
  const formData = await request.formData();

  const newTask = formData.get("task")?.toString();
  const deleteTask = formData.get("delete")?.toString();
  const completeTask = formData.get("complete")?.toString();
  const clearAll = formData.get("clearAll")?.toString();

  if (newTask) {
    const task = {
      id: state.tasks.length + 1,
      name: newTask,
      completed: false,
    };
    state.tasks.push(task);
    return new Response(JSON.stringify({ success: true, task }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  if (deleteTask) {
    const taskId = parseInt(deleteTask);
    state.tasks = state.tasks.filter((t) => t.id !== taskId);
    return new Response(JSON.stringify({ success: true }));
  }

  if (completeTask) {
    const taskId = parseInt(completeTask);
    state.tasks = state.tasks.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    return new Response(JSON.stringify({ success: true }));
  }

  if (clearAll) {
    state.tasks = state.tasks.filter((t) => !t.completed);
    return new Response(JSON.stringify({ success: true }));
  }

  return new Response(JSON.stringify({ success: false }), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  });
}
