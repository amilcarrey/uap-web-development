import { database } from "../../db/connection";
import { Permission,  CreatePermissionRequest } from "../../types";
import { v4 as uuidv4 } from "uuid";

export class PermissionRepository {
  async getAllPermissions(): Promise<Permission[]> {
    return database.all<Permission>("SELECT * FROM permissions ORDER BY created_at DESC");
  }

  async getPermissionsByUserId(user_id: string): Promise<Permission[]> {
    return database.all<Permission>("SELECT * FROM permissions WHERE user_id = ? ", [user_id]);
  }

  async getPermissionById(id: string): Promise<Permission | undefined> {
    return database.get<Permission>("SELECT * FROM permissions WHERE id = ?", [id]);
  }

  
  async getByUserAndBoard(
    user_id: string, 
    board_id: string
  ): Promise<Permission | null> {
    const query = `
      SELECT * FROM permissions 
      WHERE user_id = ? AND board_id = ?
    `;
    
    try {
      const permission = await database.get<Permission>(query, [user_id, board_id]);
      return permission || null;
    } catch (error) {
      console.error('Error getting permission:', error);
      return null;
    }
  }


  async createPermission(data: Omit<Permission, 'id' | 'created_at' | 'updated_at'>): Promise<Permission> {
    const id = uuidv4();
    const now = new Date().toISOString();

      await database.run(
      `INSERT INTO permissions
         (id, user_id, board_id, access_level, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, data.user_id, data.board_id, data.access_level, now, now]
    );
    const permission = await this.getPermissionById(id);
    if (!permission) {
      throw new Error("Failed to create permission");
    }

    return permission;
  }

  async deletePermission(id: string): Promise<boolean> {
    await database.run("DELETE FROM permissions WHERE id = ?", [id]);
    return true;
  }

  async permissionExists(id: string): Promise<boolean> {
    const permission = await this.getPermissionById(id);
    return !!permission;
  }

   async update(id: string, access_level: string): Promise<Permission> {
    const now = new Date().toISOString();
    await database.run(
      "UPDATE permissions SET access_level = ?, updated_at = ? WHERE id = ?",
      [access_level, now, id]
    );
    const updated = await this.getPermissionById(id);
    if (!updated) throw new Error("Failed to update permission");
    return updated;
  }

}

