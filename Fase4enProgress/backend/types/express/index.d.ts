import { User as PrismaUser } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

export {}; //importante para que sea un módulo
