import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class TaskRepository {
  async findAllByBoard(boardId: number) {
    return prisma.task.findMany({ where: { boardId } });
  }

  async create(data: CreateTaskDto) {
    return prisma.task.create({ data });
  }

  async delete(id: number) {
    return prisma.task.delete({ where: { id } });
  }

  async toggleComplete(id: number, completed: boolean) {
    return prisma.task.update({ where: { id }, data: { completed } });
  }
}
