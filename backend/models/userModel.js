import { connectDB } from "../db.mjs";

export async function getUserById(id) {
  const db = await connectDB();
  return db.get("SELECT * FROM users WHERE id = ?", [id]);
}

export async function getUserByUsername(username) {
  const db = await connectDB();
  return db.get("SELECT * FROM users WHERE username = ?", [username]);
}