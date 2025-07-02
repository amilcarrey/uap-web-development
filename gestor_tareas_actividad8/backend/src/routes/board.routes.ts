import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { isOwner } from '../middlewares/isOwner';
import { canViewBoard } from '../middlewares/canViewBoard';
import { canEditBoard } from '../middlewares/canEditBoard';

const router = Router();
const prisma = new PrismaClient();

// 🔐 Crear un tablero y asignar OWNER
router.post('/', isAuthenticated, async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: 'No autenticado' });
    return;
  }

  const { name } = req.body;

  try {
    const nuevo = await prisma.board.create({
      data: { name, ownerId: userId }
    });
    res.status(201).json(nuevo);
  } catch (error) {
    console.error('Error al crear tablero:', error);
    res.status(500).json({ error: 'Error al crear el tablero' });
  }
});

// 📋 Listar tableros accesibles
router.get('/', isAuthenticated, async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;

  try {
    const propios = await prisma.board.findMany({ where: { ownerId: userId } });

    const compartidos = await prisma.sharedBoard.findMany({
      where: { userId },
      include: { board: true }
    });

    const todos = [...propios, ...compartidos.map(entry => entry.board)];

    res.json(todos);
  } catch (error) {
    console.error('Error al listar tableros:', error);
    res.status(500).json({ error: 'Error al obtener los tableros' });
  }
});

// 🗑️ Eliminar un tablero (solo si sos OWNER)
router.delete('/:boardId', isAuthenticated, isOwner, async (req: Request, res: Response): Promise<void> => {
  const { boardId } = req.params;

  try {
    await prisma.board.delete({ where: { id: boardId } });
    res.json({ message: 'Tablero eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar tablero:', error);
    res.status(500).json({ error: 'Error al eliminar el tablero' });
  }
});

// 👀 Ver un tablero (solo si tenés permiso)
router.get('/:boardId', canViewBoard, (req: Request, res: Response): void => {
  res.json({ message: 'Accediste al tablero' });
});

// ✏️ Editar un tablero (solo si sos editor o owner)
router.put('/:boardId', canEditBoard, (req: Request, res: Response): void => {
  res.json({ message: 'Tablero editado' });
});

// 🤝 Compartir un tablero
router.post('/:boardId/share', isOwner, async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, role } = req.body;
    const { boardId } = req.params;
    const validRoles = ['EDITOR', 'VIEWER'];

    if (!validRoles.includes(role)) {
      res.status(400).json({ error: 'Rol inválido. Debe ser EDITOR o VIEWER' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    const existingShare = await prisma.sharedBoard.findFirst({
      where: { userId: user.id, boardId }
    });

    const shared = existingShare
      ? await prisma.sharedBoard.update({
          where: {
            userId_boardId: {
              userId: user.id,
              boardId
            }
          },
          data: { role }
        })
      : await prisma.sharedBoard.create({
          data: { userId: user.id, boardId, role }
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
