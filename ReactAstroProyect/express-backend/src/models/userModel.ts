import { database } from "../db.js";
import { randomUUID } from "crypto";

export type User = {
  id: string;
  email: string;
  password: string;
  role: "user" | "admin";
};

//Tipo sin password para respuestas
export type UserResponse = {
  id: string;
  email: string;
  role: "user" | "admin";
};

export async function createUserTableIfNotExists() {
  await database.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user'
    )
  `);
}

export async function createUser(email: string, password: string, role: "user" | "admin" = "user"): Promise<User> {
  const id = randomUUID();
  await database.run(
    `INSERT INTO users (id, email, password, role) VALUES (?, ?, ?, ?)`,
    [id, email, password, role]
  );
  return { id, email, password, role };
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  return database.get<User>(`SELECT * FROM users WHERE email = ?`, [email]);
}

export async function getAllUsers(): Promise<User[]> {
  return database.all<User>(`SELECT * FROM users`);
}