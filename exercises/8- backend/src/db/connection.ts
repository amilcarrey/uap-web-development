import sqlite3 from "sqlite3";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

class Database {
  private db: sqlite3.Database;

  constructor() {
    const dbPath =
      process.env.DATABASE_PATH ||
      path.join(__dirname, "../../database.sqlite");
    this.db = new sqlite3.Database(dbPath);
    this.init();
  }

  private async init(): Promise<void> {
    if (process.env.POPULATE_DB === "true") {
      await this.createTables();
      await this.seedData();
    }
  }

  private async createTables(): Promise<void> {
    // Users table
    await this.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Boards table (equivalent to tabs)
    await this.run(`
      CREATE TABLE IF NOT EXISTS boards (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        owner_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `);

    // Board permissions table
    await this.run(`
      CREATE TABLE IF NOT EXISTS board_permissions (
        id TEXT PRIMARY KEY,
        board_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        permission_level TEXT NOT NULL CHECK (permission_level IN ('owner', 'editor', 'viewer')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (board_id) REFERENCES boards (id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        UNIQUE(board_id, user_id)
      )
    `);

    // Tasks table
    await this.run(`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        board_id TEXT NOT NULL,
        text TEXT NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (board_id) REFERENCES boards (id) ON DELETE CASCADE
      )
    `);

    // Create indexes for better performance
    await this.run(
      `CREATE INDEX IF NOT EXISTS idx_boards_owner ON boards(owner_id)`
    );
    await this.run(
      `CREATE INDEX IF NOT EXISTS idx_tasks_board ON tasks(board_id)`
    );
    await this.run(
      `CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed)`
    );
    await this.run(
      `CREATE INDEX IF NOT EXISTS idx_board_permissions_board ON board_permissions(board_id)`
    );
    await this.run(
      `CREATE INDEX IF NOT EXISTS idx_board_permissions_user ON board_permissions(user_id)`
    );
  }

  private async seedData(): Promise<void> {
    try {
      // Check if we already have seed data
      const existingUser = await this.get("SELECT id FROM users LIMIT 1");
      if (existingUser) {
        return; // Data already seeded
      }

      // Create a demo user (password: "demo123")
      const demoUserId = "demo-user-id";
      const hashedPassword =
        "$2a$10$vQqN5xyj3FPk1tE2Nkv7wOb.ELwJX1JO3fJ.MWJXk7bQ2JQ5.N8O2"; // bcrypt hash for "demo123"

      await this.run(
        "INSERT INTO users (id, username, email, password_hash) VALUES (?, ?, ?, ?)",
        [demoUserId, "demo", "demo@example.com", hashedPassword]
      );

      // Create demo boards
      const todayBoardId = "today-board";
      const workBoardId = "work-board";

      await this.run(
        "INSERT INTO boards (id, name, description, owner_id) VALUES (?, ?, ?, ?)",
        [todayBoardId, "today", "Today's tasks", demoUserId]
      );

      await this.run(
        "INSERT INTO boards (id, name, description, owner_id) VALUES (?, ?, ?, ?)",
        [workBoardId, "work", "Work tasks", demoUserId]
      );

      // Create board permissions for the owner
      await this.run(
        "INSERT INTO board_permissions (id, board_id, user_id, permission_level) VALUES (?, ?, ?, ?)",
        ["perm-1", todayBoardId, demoUserId, "owner"]
      );

      await this.run(
        "INSERT INTO board_permissions (id, board_id, user_id, permission_level) VALUES (?, ?, ?, ?)",
        ["perm-2", workBoardId, demoUserId, "owner"]
      );

      // Create demo tasks
      await this.run(
        "INSERT INTO tasks (id, board_id, text, completed) VALUES (?, ?, ?, ?)",
        ["task-1", todayBoardId, "Welcome to the ToDo app!", false]
      );

      await this.run(
        "INSERT INTO tasks (id, board_id, text, completed) VALUES (?, ?, ?, ?)",
        ["task-2", todayBoardId, "Create your first task", false]
      );

      await this.run(
        "INSERT INTO tasks (id, board_id, text, completed) VALUES (?, ?, ?, ?)",
        ["task-3", workBoardId, "Review project requirements", true]
      );

      console.log("Database seeded with demo data");
    } catch (error) {
      console.error("Error seeding database:", error);
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

export async function initializeDatabase(): Promise<void> {
  // The database is already initialized in the constructor
  // This function is just for explicit initialization call
  console.log("Database connection established");
}
