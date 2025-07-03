import { connectDB } from "../db.mjs";

export async function getTasks(boardId) {
  const db = await connectDB();
  return db.all("SELECT * FROM tasks WHERE board_id = ?", [boardId]);
}

export async function createTask(text, boardId) {
  const db = await connectDB();
  const { lastID } = await db.run(
    "INSERT INTO tasks (text, board_id, completed) VALUES (?, ?, false)",
    [text, boardId]
  );
  return { id: lastID, text, board_id: boardId, completed: false };
}

export async function toggleTask(id) {
  const db = await connectDB();
  const task = await db.get("SELECT * FROM tasks WHERE id = ?", [id]);
  if (!task) throw new Error("No encontrada");

  const updated = !task.completed;
  await db.run("UPDATE tasks SET completed = ? WHERE id = ?", [updated, id]);
  return { ...task, completed: updated };
}

export async function deleteTask(id) {
  const db = await connectDB();
  await db.run("DELETE FROM tasks WHERE id = ?", [id]);
}

export async function updateTaskText(id, text) {
  const db = await connectDB();
  await db.run("UPDATE tasks SET text = ? WHERE id = ?", [text, id]);
}

export async function clearCompletedTasks(boardId) {
  const db = await connectDB();
  await db.run("DELETE FROM tasks WHERE board_id = ? AND completed = true", [boardId]);
}