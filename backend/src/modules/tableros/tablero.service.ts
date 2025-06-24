import  db  from "../../db/knex";
import { Tablero } from "../../types/index";

export const getAllTableros = async (): Promise<Tablero[]> => {
  return await db<Tablero>("tableros").select("*");
};

export const getTableroById = async (id: number): Promise<Tablero | undefined> => {
  return await db<Tablero>("tableros").where({ id }).first();
};

export const createTablero = async (data: Omit<Tablero, "id">): Promise<Tablero> => {
  const [newTablero] = await db<Tablero>("tableros").insert(data).returning("*");
  return newTablero;
};

export const updateTablero = async (
  id: number,
  data: Partial<Tablero>
): Promise<Tablero | undefined> => {
  const [updated] = await db<Tablero>("tableros").where({ id }).update(data).returning("*");
  return updated;
};

export const deleteTablero = async (id: number): Promise<number> => {
  return await db<Tablero>("tableros").where({ id }).delete();
};
