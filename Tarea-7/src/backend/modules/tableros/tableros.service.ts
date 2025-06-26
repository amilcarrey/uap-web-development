import { Tablero, CreateTableroRequest } from "../../types";
import { TableroRepository } from "./tableros.repository";
import { PermissionsRepository } from "../permissions/permissions.repository";
import { CreatePermissionRequest } from "../../types";

export class TableroService {
  private permissionsRepo = new PermissionsRepository();

  constructor(private readonly repo: TableroRepository) {}

  getAll(userId: string): Promise<Tablero[]> {
    return this.repo.getAllByUser(userId);
  }

  getById(id: string): Promise<Tablero | undefined> {
    return this.repo.getById(id);
  }

  async create(data: CreateTableroRequest & { ownerId: string }): Promise<Tablero> {
    const tablero = await this.repo.create(data);

    const permiso: CreatePermissionRequest = {
      usuarioId: data.ownerId,
      tableroId: tablero.id,
      nivel: "propietario",
    };

    await this.permissionsRepo.assignPermission(permiso);

    return tablero;
  }

  delete(id: string): Promise<void> {
    return this.repo.delete(id);
  }

  exists(id: string): Promise<boolean> {
    return this.repo.exists(id);
  }
}
