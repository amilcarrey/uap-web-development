import type { APIRoute } from "astro";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const dbPath = path.resolve("christian-barreto-2/backend/db.json");

async function leerDB() {
  const data = await fs.readFile(dbPath, "utf-8");
  return JSON.parse(data);
}

async function escribirDB(data: any) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
}

export const get: APIRoute = async () => {
  const db = await leerDB();
  return {
    body: JSON.stringify(db.tableros),
  };
};

export const post: APIRoute = async ({ request }) => {
  const { nombre } = await request.json();
  if (!nombre) return { status: 400, body: JSON.stringify({ error: "Nombre es requerido" }) };

  const db = await leerDB();
  const nuevoTablero = { id: uuidv4(), nombre, fecha_creacion: new Date().toISOString() };
  db.tableros.push(nuevoTablero);
  await escribirDB(db);

  return {
    status: 201,
    body: JSON.stringify(nuevoTablero),
  };
};

export const patch: APIRoute = async ({ request }) => {
  const { id, nombre } = await request.json();
  if (!id || !nombre) return { status: 400, body: JSON.stringify({ error: "Id y nombre son requeridos" }) };

  const db = await leerDB();
  const tablero = db.tableros.find((t: any) => t.id === id);
  if (!tablero) return { status: 404, body: JSON.stringify({ error: "Tablero no encontrado" }) };

  tablero.nombre = nombre;
  tablero.fecha_modificacion = new Date().toISOString();

  await escribirDB(db);
  return { body: JSON.stringify(tablero) };
};

export const del: APIRoute = async ({ request }) => {
  const { id } = await request.json();
  if (!id) return { status: 400, body: JSON.stringify({ error: "Id es requerido" }) };

  const db = await leerDB();
  const index = db.tableros.findIndex((t: any) => t.id === id);
  if (index === -1) return { status: 404, body: JSON.stringify({ error: "Tablero no encontrado" }) };

  db.tableros.splice(index, 1);

  // Opcional: borrar tareas asociadas a este tablero
  db.tareas = db.tareas.filter((t: any) => t.tableroId !== id);

  await escribirDB(db);
  return { body: JSON.stringify({ message: "Tablero eliminado" }) };
};
