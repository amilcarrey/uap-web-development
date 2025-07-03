import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class BoardRepository {
  async findAll() {
    return prisma.board.findMany();
  }

  async findById(id: number) {
    return prisma.board.findUnique({ where: { id } });
  }

  async create(data: { name: string; ownerId: number }) {
    return prisma.board.create({ data });
  }

  async delete(id: number) {
    return prisma.board.delete({ where: { id } });
  }

  async exists(id: number): Promise<boolean> {
    const count = await prisma.board.count({ where: { id } });
    return count > 0;
  }
}
