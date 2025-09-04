// src/utils/db.ts
import Database from "better-sqlite3";

const isTest = process.env.NODE_ENV === "test";

// Si estamos en test, usamos memoria, si no usamos archivo real
const db = isTest
  ? new Database(":memory:")
  : new Database("./reviews.db");

// Crear tabla si no existe
db.prepare(`
  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bookId TEXT NOT NULL,
    author TEXT NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT NOT NULL,
    votesUp INTEGER DEFAULT 0,
    votesDown INTEGER DEFAULT 0,
    createdAt TEXT NOT NULL
  )
`).run();

export default db;
