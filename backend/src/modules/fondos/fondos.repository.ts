import db from "../../db/knex";
import { v4 as uuidv4 } from "uuid";

export const getFondosByUser = async (userId: string) => {
  return db("user_fondos").where({ user_id: userId }).select("id", "url");
};

export const addFondo = async (userId: string, url: string) => {
  const id = uuidv4();
  await db("user_fondos").insert({ id, user_id: userId, url });
  return { id, url };
};

export const deleteFondo = async (userId: string, fondoId: string) => {
  return db("user_fondos").where({ user_id: userId, id: fondoId }).del();
};