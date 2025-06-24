import { v4 as uuidv4 } from "uuid";
import db from "../../db/knex";

export const obtenerTableros = () => db("tableros").select("*");

export const crearTablero = (nombre: string) =>
  db("tableros").insert({ id: uuidv4(), nombre });
