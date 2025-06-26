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
    if (process.env.RESET_DB === "true") {
      console.log("⚠ Reiniciando base de datos...");
      await this.run(`DROP TABLE IF EXISTS tasks`);
      await this.run(`DROP TABLE IF EXISTS boards`);
    }

    // Creo la tabla de usuarios
    await this.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      )
    `);

    // Crear tabla de tableros
    await this.run(`
      CREATE TABLE IF NOT EXISTS boards (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL, 
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        owner_id TEXT NOT NULL,
        FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Crear tabla de tareas
    await this.run(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT NOT NULL,
        completed BOOLEAN DEFAULT false,
        board_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE
      )
    `);

    //creacion de tabla relacion usuario-tablero
    await this.run(`
     CREATE TABLE IF NOT EXISTS board_permissions (
      board_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      role TEXT CHECK (role IN ('owner', 'editor', 'viewer')) NOT NULL,
      PRIMARY KEY (board_id, user_id),
      FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);


    // tabla de configuración de usuario
    await this.run(`
      CREATE TABLE IF NOT EXISTS user_settings (
        user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        uppercaseDescriptions BOOLEAN DEFAULT FALSE
      )
    `);

    // insersion de valores por defecto si POPULATE_DB es true
    if (process.env.POPULATE_DB === "true") {
      const now = new Date().toISOString();


      //aqui creo un usuario admin por defecto para testear con el man
      const testPropietario= "8a6db151-e8e7-416e-964c-c11699ffb287";
      const newLocal = "INSERT OR IGNORE INTO users (id, email, password) VALUES (?, ?, ?)";
      await this.run(
        newLocal,
        [testPropietario, "usuarioPrueba@example.com", "123456"]
      );

      const defaultBoards = [
        { id: "personal", name: "Personal", description: "Tareas personales" },
        { id: "profesional", name: "Profesional", description: "Tareas del trabajo" },
      ];

      for (const board of defaultBoards) {
        const exists = await this.get("SELECT * FROM boards WHERE id = ?", [board.id]);
        if (!exists) {
          await this.run(
            "INSERT INTO boards (id, name, description, created_at, updated_at, owner_id) VALUES (?, ?, ?, ?, ?, ?)",
            [board.id, board.name, board.description, now, now, testPropietario]
          );
        }
      }

      // Agregar una tarea de ejemplo solo si no hay tareas aún
      const taskCount = await this.get<{ count: number }>("SELECT COUNT(*) as count FROM tasks");
      if ((taskCount?.count ?? 0) === 0) {
        await this.run(
          "INSERT INTO tasks (text, completed, board_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
          ["Jugar futbol", false, "personal", now, now]
        );
      }
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
