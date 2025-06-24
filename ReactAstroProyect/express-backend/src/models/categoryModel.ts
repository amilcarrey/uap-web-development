import { database } from "../db.js";

export async function createCategoryTable(): Promise<void> {
  await database.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL
    )
  `);
}

//función para crear la tabla de permisos
export async function createCategoryPermissionsTable(): Promise<void> {
  await database.run(`
    CREATE TABLE IF NOT EXISTS category_permissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      categoryId TEXT NOT NULL,
      userId TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('owner', 'editor', 'viewer')),
      FOREIGN KEY (categoryId) REFERENCES categories (id) ON DELETE CASCADE,
      FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
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

export async function addCategoryPermission(categoryId: string, userId: string, role: string): Promise<void> {
  await database.run(
    "INSERT INTO category_permissions (categoryId, userId, role) VALUES (?, ?, ?)",
    [categoryId, userId, role]
  );
}

// Verificar si un usuario tiene un permiso específico en una categoría
// requiredRole puede ser "owner", "editor" o "viewer"
export async function checkCategoryPermission(categoryId: string, userId: string, requiredRole: string): Promise<boolean> {
  const result = await database.get(
    "SELECT 1 FROM category_permissions WHERE categoryId = ? AND userId = ? AND role = ?",
    [categoryId, userId, requiredRole]
  );
  return !!result;
}

// Obtener todos los usuarios con permisos en una categoría
export async function getCategoryPermissions(categoryId: string) {
  return await database.all(
    `SELECT cp.userId, cp.role, u.email 
     FROM category_permissions cp 
     JOIN users u ON cp.userId = u.id 
     WHERE cp.categoryId = ?`,
    [categoryId]
  );
}

// Actualizar el rol de un usuario en una categoría
export async function updateCategoryPermission(categoryId: string, userId: string, newRole: string): Promise<void> {
  await database.run(
    "UPDATE category_permissions SET role = ? WHERE categoryId = ? AND userId = ?",
    [newRole, categoryId, userId]
  );
}

// Eliminar un permiso de categoría
export async function removeCategoryPermission(categoryId: string, userId: string): Promise<void> {
  await database.run(
    "DELETE FROM category_permissions WHERE categoryId = ? AND userId = ?",
    [categoryId, userId]
  );
}

// buscar usuario por email
export async function getUserByEmail(email: string) {
  return await database.get("SELECT id, email, role FROM users WHERE email = ?", [email]);
}
