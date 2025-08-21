import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class UserRepository {
  async findByUsername(username: string) {
    return prisma.user.findUnique({ where: { username } });
  }

  async findById(id: number) {
    return prisma.user.findUnique({ where: { id } });
  }

  async create(data: { username: string; password: string; firstName: string; lastName: string }) {
    return prisma.user.create({ data });
  }
}
