import { CreatePermissionRequest, Permission } from "../../types/index";
import { database } from "../../db/connection";

export class PermissionsRepository {
  async assignPermission(data: CreatePermissionRequest) {
    const { tableroId, usuarioId, nivel } = data;

    const existing = await database.get<Permission>(
      `SELECT * FROM permisos WHERE tableroId = ? AND usuarioId = ?`,
      [tableroId, usuarioId]
    );

    if (existing) {
      const sqlUpdate = `UPDATE permisos SET nivel = ? WHERE tableroId = ? AND usuarioId = ?`;
      await database.run(sqlUpdate, [nivel, tableroId, usuarioId]);
    } else {
      const sqlInsert = `INSERT INTO permisos (tableroId, usuarioId, nivel) VALUES (?, ?, ?)`;
      await database.run(sqlInsert, [tableroId, usuarioId, nivel]);
    }
  }

  async checkUserPermission(tableroId: string, usuarioId: string): Promise<Permission | undefined> {
    return database.get<Permission>(
      `SELECT * FROM permisos WHERE tableroId = ? AND usuarioId = ?`,
      [tableroId, usuarioId]
    );
  }

async getPermissionForUser(usuarioId: string, tableroId: string): Promise<Permission | null> {
  const result = await database.get<Permission>(
    `SELECT * FROM permisos WHERE usuarioId = ? AND tableroId = ?`,
    [usuarioId, tableroId]
  );

  return result ?? null;
}



  async getPermissionsByTablero(tableroId: string): Promise<Permission[]> {
    return database.all<Permission>(
      `SELECT * FROM permisos WHERE tableroId = ?`,
      [tableroId]
    );
  }

  async removePermission(tableroId: string, usuarioId: string): Promise<void> {
    await database.run(
      `DELETE FROM permisos WHERE tableroId = ? AND usuarioId = ?`,
      [tableroId, usuarioId]
    );
  }
}
