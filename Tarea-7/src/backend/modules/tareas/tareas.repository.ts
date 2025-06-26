import { database } from "../../db/connection";
import { CreateTareaRequest, UpdateTareaRequest } from "../../types";

export class TareasRepository {
  static async getAll(tableroId: string) {
    return database.all("SELECT * FROM tareas WHERE tableroId = ?", [tableroId]);
  }

  static async getById(id: number) {
    return database.get("SELECT * FROM tareas WHERE id = ?", [id]);
  }

  static async create(tarea: CreateTareaRequest) {
    return database.run(
      `INSERT INTO tareas (content, completed, tableroId, created_at, updated_at) 
       VALUES (?, 0, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [tarea.content, tarea.tableroId]
    );
  }

  static async update(tarea: UpdateTareaRequest) {
    return database.run(
      `UPDATE tareas 
       SET content = ?, completed = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [tarea.content, tarea.completed, tarea.id]
    );
  }

  static async delete(id: number) {
    return database.run("DELETE FROM tareas WHERE id = ?", [id]);
  }

  static async getPaginated(tableroId: string, limit: number, offset: number) {
  return database.all(
    "SELECT * FROM tareas WHERE tableroId = ? LIMIT ? OFFSET ?",
    [tableroId, limit, offset]
  );
}

static async getCount(tableroId: string) {
  const row = await database.get<{ count: number }>(
    "SELECT COUNT(*) as count FROM tareas WHERE tableroId = ?",
    [tableroId]
  );
  return row?.count ?? 0;
}

}
 