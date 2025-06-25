import sqlite3 from "sqlite3";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

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
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await this.run(`
      CREATE TABLE IF NOT EXISTS boards (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        owner_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `);

      await this.run(`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        board_id TEXT NOT NULL,
        name TEXT NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (board_id) REFERENCES boards (id) ON DELETE CASCADE

      )
    `);

     await this.run(`
      CREATE TABLE IF NOT EXISTS permissions (
      user_id TEXT NOT NULL,
      board_id TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('owner', 'editor', 'viewer')),
      PRIMARY KEY (user_id, board_id),
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (board_id) REFERENCES boards (id) ON DELETE CASCADE
      )
    `);


    

      

      await this.run(`
       INSERT OR IGNORE INTO users (id,email, password, name) VALUES ('1', 'admin@example.com', '1234', 'Admin User');
     `);
      await this.run(`
        INSERT OR IGNORE INTO boards (id, name, owner_id) VALUES ('profesional:1', 'Default Board', '1');
     `);
      await this.run(`
        INSERT OR IGNORE INTO tasks (id, board_id, name, completed) VALUES ('1', '1', 'Sample Task', 0);
     `);
      await this.run(`
        INSERT OR IGNORE INTO permissions (user_id, board_id, role) VALUES ('1', '1', 'owner');
     `);
     
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