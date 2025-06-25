// src/db.ts
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.resolve(__dirname, '../../data/database.db');
console.log('📁 Ruta de la base de datos usada:', dbPath);

fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);

db.exec(`PRAGMA foreign_keys = OFF;

CREATE TABLE IF NOT EXISTS usuarios (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  configuracion_json TEXT
);

CREATE TABLE IF NOT EXISTS tableros (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  propietarioId TEXT NOT NULL,
  FOREIGN KEY(propietarioId) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS tareas (
  id TEXT PRIMARY KEY,
  texto TEXT NOT NULL,
  completada INTEGER NOT NULL DEFAULT 0,
  tableroId TEXT,
  FOREIGN KEY(tableroId) REFERENCES tableros(id)
);

CREATE TABLE IF NOT EXISTS permisos_tablero (
  id TEXT PRIMARY KEY,
  tableroId TEXT NOT NULL,
  usuarioId TEXT NOT NULL,
  rol TEXT NOT NULL,
  UNIQUE(tableroId, usuarioId),
  FOREIGN KEY(tableroId) REFERENCES tableros(id),
  FOREIGN KEY(usuarioId) REFERENCES usuarios(id)
);
`);

export default db;
