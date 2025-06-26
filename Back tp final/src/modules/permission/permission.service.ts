import { Permission } from "../../types";
import { PermissionRepository } from "./permission.repository";
import { AccessLevel } from "../../enum/access-level.enum";
import { BoardRepository } from "../board/board.repository";
 export class PermissionService {
   constructor(private readonly permissionRepository: PermissionRepository, private boardRepo = new BoardRepository(),
    private permissionRepo = new PermissionRepository()) {}

   async getAllPermissions(): Promise<Permission[]> {
     return this.permissionRepository.getAllPermissions();
   }

    async getPermissionsByUserId(user_id: string): Promise<Permission[]> {
      return this.permissionRepository.getPermissionsByUserId(user_id);
    }
   async getPermissionById(id: string): Promise<Permission | undefined> {
     return this.permissionRepository.getPermissionById(id);
   }

   async getByUserAndBoard(userId: string, boardId: string): Promise<Permission | null> {
     return this.permissionRepository.getByUserAndBoard(userId, boardId);
   }

   async createPermission(permissionData: Omit<Permission, 'id' | 'created_at' | 'updated_at'>): Promise<Permission> {
     return this.permissionRepository.createPermission(permissionData);
   }

   async deletePermission(id: string): Promise<boolean> {
     return this.permissionRepository.deletePermission(id);
   }

   async changeAccessLevel(id: string, access_level: string): Promise<Permission> {
     return this.permissionRepository.update(id, access_level);
   }

  // Método para obtener el nivel de acceso de un usuario a un tablero
   async getPermissionForUser(
    user_id: string, 
    board_id: string
  ): Promise<AccessLevel | undefined> {
    //con pasitos a lo p11
    // Paso 1: Verificar si el usuario es el dueño del tablero
    const board = await this.boardRepo.getBoardById(board_id);
    if (board && board.owner_id === user_id) {
      return AccessLevel.owner;
    }

    // Paso 2: Buscar permiso explícito en la tabla de permisos
    const permission = await this.permissionRepo.getByUserAndBoard(user_id, board_id);
    
    return permission?.access_level;
  }

  // // Versión para el middleware que necesita más detalles
  // async getFullPermissionForUser(
  //   user_id: string, 
  //   board_id: string
  // ): Promise<{ access_level: AccessLevel; is_owner: boolean }> {
  //   const board = await this.boardRepo.getBoardById(board_id);
  //   if (!board) {
  //     return {
  //       access_level: AccessLevel.viewer,
  //       is_owner: false
  //     };
  //   }
  //   const isOwner = board.owner_id === user_id;
    
  //   if (isOwner) {
  //     return { access_level: AccessLevel.owner, is_owner: true };
  //   }

  //   const permission = await this.permissionRepo.getByUserAndBoard(user_id, board_id);
    
  //   return {
  //     access_level: permission?.access_level || AccessLevel.viewer,
  //     is_owner: false
  //   };
  // }
 // En src/services/permission.service.ts
hasSufficientPermission(
  userLevel: AccessLevel | undefined, 
  requiredLevel: AccessLevel
): boolean {
  // Definimos una jerarquía de permisos
  const permissionHierarchy = {
    [AccessLevel.viewer]: 1,
    [AccessLevel.full_access]: 2,
    [AccessLevel.owner]: 3
  };
  if (userLevel === undefined) {
    return false;
  }
  
  return permissionHierarchy[userLevel] >= permissionHierarchy[requiredLevel];
}
}
 