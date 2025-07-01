import { Router, Request, Response } from 'express';
import { isOwner } from '../middlewares/isOwner';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

router.post('/:boardId/share', isOwner, async (req: Request, res: Response): Promise<void> => {
  const { email, role } = req.body;
  const boardId = req.params.boardId;

  if (!email || !role) {
    res.status(400).json({ error: 'Email y rol son requeridos' });
    return;
  }

  const userToShare = await prisma.user.findUnique({ where: { email } });
  if (!userToShare) {
    res.status(404).json({ error: 'Usuario no encontrado' });
    return;
  }

  if (!['EDITOR', 'VIEWER'].includes(role)) {
    res.status(400).json({ error: 'Rol inválido. Debe ser EDITOR o VIEWER' });
    return;
  }

  const existing = await prisma.sharedBoard.findFirst({
  where: {
    userId: userToShare.id,
    boardId,
  },
});

if (existing) {
  await prisma.sharedBoard.update({
    where: { id: existing.id },
    data: { role },
  });
} else {
  await prisma.sharedBoard.create({
    data: {
      userId: userToShare.id,
      boardId,
      role,
    },
  });
}


  res.json({ message: `Tablero compartido con ${email} como ${role}` });
});

export default router;
