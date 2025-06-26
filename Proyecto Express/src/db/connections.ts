import sqlite3 from "sqlite3";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

class Database {
  private db: sqlite3.Database;

  constructor() {
    const dbPath = path.join(__dirname, "../../database.sqlite");
    this.db = new sqlite3.Database(dbPath);
    // Aca podemos condicionalmente crear las tablas si no existen con una variable de entorno
    this.init().catch((err) => {
      console.error("Error initializing database:", err)
    })
  }

  private async init() {
    if (process.env.POPULATE_DB === "true") {
      await this.run(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT NOT NULL,
          password TEXT NOT NULL
        )
      `);

      await this.run(`
        INSERT OR IGNORE INTO users (id, email, password)
        VALUES 
          ('user-1-id', 'user1@example.com', 'hashed_password_1'),
          ('user-2-id', 'user2@example.com', 'hashed_password_2')
      `)

      await this.run(`
        CREATE TABLE IF NOT EXISTS boards (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await this.run(`
        CREATE TABLE IF NOT EXISTS tasks (
          id TEXT PRIMARY KEY,
          text TEXT NOT NULL,
          done BOOLEAN DEFAULT FALSE,
          activeBoardId TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (activeBoardId) REFERENCES boards (id) ON DELETE CASCADE
        )
      `);

      await this.run(`
        CREATE TABLE IF NOT EXISTS board_users (
          user_id TEXT NOT NULL,
          board_id TEXT NOT NULL,
          role TEXT NOT NULL CHECK (role IN ('owner', 'editor', 'viewer')),
          PRIMARY KEY (user_id, board_id),
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE
        )
      `);

      await this.run(`
        CREATE TABLE IF NOT EXISTS settings (
          user_id TEXT PRIMARY KEY,
          refetch_interval INTEGER DEFAULT 10000,
          uppercase_descriptions BOOLEAN DEFAULT false,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);

      // Indices sobre tareas
      await this.run(`CREATE INDEX IF NOT EXISTS idx_tasks_done ON tasks (done)`);
      await this.run(`CREATE INDEX IF NOT EXISTS idx_tasks_activeBoardId ON tasks(activeBoardId)`);
      // Indice para acelerar consultas por estado de tarea y tablero activo
      await this.run(`CREATE INDEX IF NOT EXISTS idx_tasks_done_activeBoardId ON tasks (done, activeBoardId)`);

      // Indices sobre relaciones de usuarios y tableros
      await this.run(`CREATE INDEX IF NOT EXISTS idx_board_users_user_id ON board_users (user_id)`);
      await this.run(`CREATE INDEX IF NOT EXISTS idx_board_users_board_id ON board_users (board_id)`);

      // Indices por fecha de creacion
      await this.run(`CREATE INDEX IF NOT EXISTS idx_boards_created_at ON boards (created_at)`);
      await this.run(`CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks (created_at)`);
    }
  }

  async run(sql: string, params: any[] = []): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve();
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