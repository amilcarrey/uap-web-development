import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Database {
  private db: sqlite3.Database;

  constructor() {
    const dbPath = path.join(__dirname, "../../database.sqlite");
    this.db = new sqlite3.Database(dbPath);
    this.init();
  }

  private async init() {
    if (process.env.POPULATE_DB === "true") {

      await this.run(`
        CREATE TABLE IF NOT EXISTS usuarios (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await this.run(`
        CREATE TABLE IF NOT EXISTS tableros (
          id TEXT PRIMARY KEY,
          nombre TEXT NOT NULL,
          ownerId TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (ownerId) REFERENCES usuarios(id)
        )
      `);


      await this.run(`
        CREATE TABLE IF NOT EXISTS tareas (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          content TEXT NOT NULL,
          completed INTEGER DEFAULT 0,
          tableroId TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (tableroId) REFERENCES tableros(id)
        )
      `);

    
      await this.run(`
        CREATE TABLE IF NOT EXISTS permisos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          usuarioId TEXT NOT NULL,
          tableroId TEXT NOT NULL,
          nivel TEXT CHECK(nivel IN ('propietario', 'editor', 'lectura')) NOT NULL DEFAULT 'lectura',
          FOREIGN KEY (usuarioId) REFERENCES usuarios(id),
          FOREIGN KEY (tableroId) REFERENCES tableros(id),
          UNIQUE(usuarioId, tableroId)
        )
      `);


      await this.run(`CREATE INDEX IF NOT EXISTS idx_tareas_tableroId ON tareas(tableroId)`);
      await this.run(`CREATE INDEX IF NOT EXISTS idx_permisos_usuarioId ON permisos(usuarioId)`);
      await this.run(`CREATE INDEX IF NOT EXISTS idx_permisos_tableroId ON permisos(tableroId)`);
    }
  }

  async run(sql: string, params: any[] = []): Promise<{ lastID: number; changes: number }> {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  }

  async get<T>(sql: string, params: any[] = []): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row as T);
      });
    });
  }

  async all<T>(sql: string, params: any[] = []): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows as T[]);
      });
    });
  }

  close(): void {
    this.db.close();
  }
}

export const database = new Database();
