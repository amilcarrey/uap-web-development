import { database } from "./connections";

type Migration = {
  id: number;
  run: () => Promise<void>;
};

const migrations: Migration[] = [
  {
    id: 1,
    run: async () => {
      await database.run(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT NOT NULL,
          password TEXT NOT NULL
        )
      `);

      await database.run(`
        INSERT OR IGNORE INTO users (id, email, password)
        VALUES 
          ('user-1-id', 'user1@example.com', 'hashed_password_1'),
          ('user-2-id', 'user2@example.com', 'hashed_password_2')
      `)

      await database.run(`
        CREATE TABLE IF NOT EXISTS boards (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await database.run(`
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

      await database.run(`
        CREATE TABLE IF NOT EXISTS board_users (
          user_id TEXT NOT NULL,
          board_id TEXT NOT NULL,
          role TEXT NOT NULL CHECK (role IN ('owner', 'editor', 'viewer')),
          PRIMARY KEY (user_id, board_id),
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE
        )
      `);

      await database.run(`
        CREATE TABLE IF NOT EXISTS settings (
          user_id TEXT PRIMARY KEY,
          refetch_interval INTEGER DEFAULT 10000,
          uppercase_descriptions BOOLEAN DEFAULT false,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);
    },
  },

  {
    id: 2,
    run: async () => {
      await database.run(`CREATE INDEX IF NOT EXISTS idx_tasks_done ON tasks (done)`);
      await database.run(`CREATE INDEX IF NOT EXISTS idx_tasks_activeBoardId ON tasks (activeBoardId)`);
      await database.run(`CREATE INDEX IF NOT EXISTS idx_tasks_done_activeBoardId ON tasks (done, activeBoardId)`);

      await database.run(`CREATE INDEX IF NOT EXISTS idx_board_users_user_id ON board_users (user_id)`);
      await database.run(`CREATE INDEX IF NOT EXISTS idx_board_users_board_id ON board_users (board_id)`);

      await database.run(`CREATE INDEX IF NOT EXISTS idx_boards_created_at ON boards (created_at)`);
      await database.run(`CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks (created_at)`);
    },
  },
];

// Función para aplicar migraciones pendientes
export async function runMigrations() {
  // Crear tabla para registrar migraciones aplicadas
  await database.run(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY
    )
  `);

  // Obtener lista de migraciones aplicadas
  const applied = await database.all<{ id: number }>("SELECT id FROM migrations");

  const appliedIds = new Set(applied.map(m => m.id));

  for (const migration of migrations) {
    if (!appliedIds.has(migration.id)) {
      console.log(`Running migration ${migration.id}...`);
      await migration.run();
      await database.run("INSERT INTO migrations (id) VALUES (?)", [migration.id]);
      console.log(`Migration ${migration.id} applied.`);
    } else {
      console.log(`Migration ${migration.id} already applied, skipping.`);
    }
  }

  console.log("All migrations applied.");
}
