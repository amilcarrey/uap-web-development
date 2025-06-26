import { database } from "../../db/connection";
import { Tablero, CreateTableroRequest } from "../../types";
import { v4 as uuidv4 } from "uuid";

export class TableroRepository {
  async getAllByUser(userId: string): Promise<Tablero[]> {
    return database.all<Tablero>(
      `
      SELECT t.*
      FROM tableros t
      JOIN permisos p ON t.id = p.tableroId
      WHERE p.usuarioId = ?
      ORDER BY t.created_at DESC
      `,
      [userId]
    );
  }

  async getById(id: string): Promise<Tablero | undefined> {
    return database.get<Tablero>("SELECT * FROM tableros WHERE id = ?", [id]);
  }

  async create(data: CreateTableroRequest & { ownerId: string }): Promise<Tablero> {
    const id = uuidv4();
    const now = new Date().toISOString();

    await database.run(
      `INSERT INTO tableros (id, nombre, ownerId, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`,
      [id, data.nombre, data.ownerId, now, now]
    );

    const tablero = await this.getById(id);
    if (!tablero) throw new Error("No se pudo crear el tablero");

    return tablero;
  }

  async delete(id: string): Promise<void> {
    await database.run("DELETE FROM tableros WHERE id = ?", [id]);
  }

  async exists(id: string): Promise<boolean> {
    const tablero = await this.getById(id);
    return !!tablero;
  }
}
