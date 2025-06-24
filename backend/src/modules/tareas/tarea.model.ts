import db from "../../db/knex";
import { v4 as uuidv4 } from "uuid";

export const obtenerTareas = (tableroId: string) =>
  db("tareas").where({ tableroId }).select("*");

export const crearTarea = (texto: string, tableroId: string) => {
  const now = new Date().toISOString();
  return db("tareas").insert({
    id: uuidv4(), // <-- Genera un id único
    texto,
    tableroId,
    completada: false,
    fecha_creacion: now,
    fecha_modificacion: now,
    fecha_realizada: null,
  });
};
