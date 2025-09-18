import { BoardPermissionRepository } from "./boardPermission.repository";
import { BoardPermissionDto } from "./boardPermission.dto";

export class BoardPermissionService {
  private repo = new BoardPermissionRepository();

  async assign(dto: BoardPermissionDto) {
    return this.repo.assignPermission(dto.boardId, dto.userId, dto.level as any);
  }

  async getUserPermissions(userId: number) {
    return this.repo.getPermissionsForUser(userId);
  }
}
