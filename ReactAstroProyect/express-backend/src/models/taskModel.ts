import { database } from "../db.js";

export async function createTaskTable(): Promise<void> {
  await database.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      completed BOOLEAN DEFAULT 0,
      categoriaId TEXT NOT NULL,
      FOREIGN KEY (categoriaId) REFERENCES categories (id) ON DELETE CASCADE
    )
  `);
}

export async function addTask(text: string, categoriaId: string): Promise<void> {
  await database.run("INSERT INTO tasks (text, categoriaId) VALUES (?, ?)", [text, categoriaId]);
}

export async function deleteTask(id: number): Promise<void> {
  await database.run("DELETE FROM tasks WHERE id = ?", [id]);
}

export async function toggleTaskCompletion(id: number): Promise<void> {
  await database.run("UPDATE tasks SET completed = NOT completed WHERE id = ?", [id]);
}

export async function getTasks(
  categoriaId?: string,
  filtro?: "completadas" | "pendientes"
): Promise<{ id: number; text: string; completed: boolean; categoriaId: string }[]> {
  let whereClause = "";
  const params: any[] = [];

  if (categoriaId) {
    whereClause += "WHERE categoriaId = ?";
    params.push(categoriaId);
  }

  if (filtro === "completadas") {
    whereClause += whereClause ? " AND completed = 1" : "WHERE completed = 1";
  } else if (filtro === "pendientes") {
    whereClause += whereClause ? " AND completed = 0" : "WHERE completed = 0";
  }

  return await database.all(`SELECT * FROM tasks ${whereClause}`, params);
}

export async function deleteCompletedTasks(categoriaId: string): Promise<void> {
  await database.run("DELETE FROM tasks WHERE categoriaId = ? AND completed = 1", [categoriaId]);
}

export async function listarTareasPaginadas(
  page: number,
  pageSize: number,
  categoriaId?: string,
  filtro?: "completadas" | "pendientes"
): Promise<{ id: number; text: string; completed: boolean; categoriaId: string }[]> {
  const offset = (page - 1) * pageSize;
  let whereClause = "";
  const params: any[] = [];

  if (categoriaId) {
    whereClause += "WHERE categoriaId = ?";
    params.push(categoriaId);
  }

  if (filtro === "completadas") {
    whereClause += whereClause ? " AND completed = 1" : "WHERE completed = 1";
  } else if (filtro === "pendientes") {
    whereClause += whereClause ? " AND completed = 0" : "WHERE completed = 0";
  }

  params.push(pageSize, offset);

  return await database.all(
    `SELECT * FROM tasks ${whereClause} LIMIT ? OFFSET ?`,
    params
  );
}

export async function contarTareasFiltradas(
  categoriaId?: string,
  filtro?: "completadas" | "pendientes"
): Promise<number> {
  let whereClause = "";
  const params: any[] = [];

  if (categoriaId) {
    whereClause += "WHERE categoriaId = ?";
    params.push(categoriaId);
  }

  if (filtro === "completadas") {
    whereClause += whereClause ? " AND completed = 1" : "WHERE completed = 1";
  } else if (filtro === "pendientes") {
    whereClause += whereClause ? " AND completed = 0" : "WHERE completed = 0";
  }

  const result = await database.get<{ count: number }>(
    `SELECT COUNT(*) as count FROM tasks ${whereClause}`,
    params
  );

  return result?.count ?? 0;
}


export async function editTask(id: number, text: string, categoriaId: string): Promise<void> {
  await database.run(
    "UPDATE tasks SET text = ?, categoriaId = ? WHERE id = ?",
    [text, categoriaId, id]
  );
}

