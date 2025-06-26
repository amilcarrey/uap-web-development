import sqlite3 from "sqlite3";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class Database {
  private db: sqlite3.Database;

  constructor() {
    const dbPath = path.join(__dirname, "../../database.sqlite");
    this.db = new sqlite3.Database(dbPath);
    this.init();
  }

  private async init() {
        //HABILITAR FOREIGN KEYS
    await this.run("PRAGMA foreign_keys = ON");
    // Crear tablas si no existen
    if (process.env.POPULATE_DB === "true") {
      console.log("Inicializando tablas...");
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
