import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class PreferenceRepository {
  async findByUserId(userId: number) {
    return prisma.preference.findUnique({ where: { userId } });
  }

  async update(userId: number, data: any) {
    return prisma.preference.update({ where: { userId }, data });
  }
}
