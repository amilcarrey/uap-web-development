import { database } from "../db.js";

export async function createCategoryTable(): Promise<void> {
  await database.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL
    )
  `);
}

export async function addCategory(id: string, name: string): Promise<void> {
  await database.run("INSERT INTO categories (id, name) VALUES (?, ?)", [id, name]);
}

export async function deleteCategory(id: string): Promise<void> {
  await database.run("DELETE FROM categories WHERE id = ?", [id]);
}

export async function getCategories(): Promise<{ id: string; name: string }[]> {
  return await database.all("SELECT * FROM categories");
}

export async function categoryExists(id: string): Promise<boolean> {
  const row = await database.get("SELECT 1 FROM categories WHERE id = ?", [id]);
  return !!row;
}

export async function getCategoriesByUserId(userId: string) {
  return database.all("SELECT * FROM categories WHERE user_id = ?", [userId]);
}
