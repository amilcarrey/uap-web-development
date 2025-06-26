import { PermissionLevel, Permission } from "../../types/index";
import { PermissionsRepository } from "./permissions.repository";

export class PermissionsService {
  constructor(private readonly repo: PermissionsRepository) {}

  assignPermission(tableroId: string, usuarioId: string, nivel: PermissionLevel): Promise<void> {
    return this.repo.assignPermission({ tableroId, usuarioId, nivel });
  }

  checkUserPermission(tableroId: string, usuarioId: string): Promise<Permission | undefined> {
    return this.repo.checkUserPermission(tableroId, usuarioId);
  }

  getPermissionsByTablero(tableroId: string): Promise<Permission[]> {
    return this.repo.getPermissionsByTablero(tableroId);
  }

  removePermission(tableroId: string, usuarioId: string): Promise<void> {
    return this.repo.removePermission(tableroId, usuarioId);
  }
}
