import { PrismaClient, PermissionLevel } from "@prisma/client";
const prisma = new PrismaClient();

export class BoardPermissionRepository {
  async assignPermission(boardId: number, userId: number, level: PermissionLevel) {
    return prisma.boardPermission.create({
      data: { boardId, userId, level }
    });
  }

  async getPermissionsForUser(userId: number) {
    return prisma.boardPermission.findMany({ where: { userId } });
  }
}
