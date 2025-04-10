import Database from 'better-sqlite3';

const db = new Database('./tareas.db');

db.exec(`CREATE TABLE IF NOT EXISTS tareas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    texto TEXT NOT NULL,
    completada INTEGER DEFAULT 0
);`);

export default db;