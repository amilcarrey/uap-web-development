import { Router, Request, Response } from 'express';
import { canViewBoard } from '../middlewares/canViewBoard';
import { canEditBoard } from '../middlewares/canEditBoard';
import { isOwner } from '../middlewares/isOwner';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Ver un tablero
router.get('/:boardId', canViewBoard, (req: Request, res: Response) => {
  res.json({ message: 'Accediste al tablero' });
});

// Editar un tablero
router.put('/:boardId', canEditBoard, (req: Request, res: Response) => {
  res.json({ message: 'Tablero editado' });
});

// Eliminar un tablero
router.delete('/:boardId', isOwner, (req: Request, res: Response) => {
  res.json({ message: 'Tablero eliminado' });
});

// Compartir un tablero con otro usuario
router.post('/:boardId/share', isOwner, async (req: Request, res: Response) => {
  try {
    const { email, role } = req.body;
    const { boardId } = req.params;
    const validRoles = ['EDITOR', 'VIEWER'];

    // Validación de rol
    if (!validRoles.includes(role)) {
      res.status(400).json({ error: 'Rol inválido. Debe ser EDITOR o VIEWER' });
      return;
    }

    // Buscar usuario
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

  // SOLUCIÓN: Versión corregida
const existingShare = await prisma.sharedBoard.findFirst({
  where: {
    userId: user.id,
    boardId: boardId
  }
});

const shared = existingShare
  ? await prisma.sharedBoard.update({
      where: { 
        userId_boardId: {  
          userId: user.id,
          boardId: boardId
        }
      },
      data: { role }
    })
  : await prisma.sharedBoard.create({
      data: {
        userId: user.id,
        boardId: boardId,
        role
      }
    });

    res.json({ 
      message: `Tablero compartido con ${email} como ${role}`,
      shared 
    });
  } catch (error) {
    console.error('Error al compartir tablero:', error);
    res.status(500).json({ error: 'Error al compartir el tablero' });
  }
});

export default router;