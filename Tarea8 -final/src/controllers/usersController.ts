import { Request, Response } from "express";
import { prisma } from "../prisma";

export const getUserByUsername = async (req: Request, res: Response) => {
  const { username } = req.params;
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
  res.json({ id: user.id, username: user.username });
};
