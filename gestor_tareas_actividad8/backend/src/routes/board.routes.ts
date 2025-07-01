import { Router, Request, Response } from 'express';
import { canViewBoard } from '../middlewares/canViewBoard';
import { canEditBoard } from '../middlewares/canEditBoard';
import { isOwner } from '../middlewares/isOwner';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { PrismaClient } from '@prisma/client';
import { RequestHandler } from 'express';

const router = Router();
const prisma = new PrismaClient();

// 🔐 Crear un tablero y asignar OWNER
router.post('/', isAuthenticated, <RequestHandler>(async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'No autenticado' });
  }

  const { name } = req.body;

  try {
    const nuevo = await prisma.board.create({
      data: {
        name,
        ownerId: userId
      }
    });

    res.status(201).json(nuevo);
  } catch (error) {
    console.error('Error al crear tablero:', error);
    res.status(500).json({ error: 'Error al crear el tablero' });
  }
}));

// 📋 Listar tableros accesibles (propios + compartidos)
router.get('/', isAuthenticated, async (req: Request, res: Response) => {
  const userId = req.user?.id;

  try {
    const propios = await prisma.board.findMany({
      where: { ownerId: userId }
    });

    const compartidos = await prisma.sharedBoard.findMany({
      where: { userId },
      include: { board: true }
    });

    const todos = [
      ...propios,
      ...compartidos.map(entry => entry.board)
    ];

    res.json(todos);
  } catch (error) {
    console.error('Error al listar tableros:', error);
    res.status(500).json({ error: 'Error al obtener los tableros' });
  }
});

router.delete('/:boardId', isAuthenticated, isOwner, async (req: Request, res: Response) => {
  const { boardId } = req.params;

  try {
    await prisma.board.delete({
      where: { id: boardId }
    });

    res.json({ message: 'Tablero eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar tablero:', error);
    res.status(500).json({ error: 'Error al eliminar el tablero' });
  }
});


// 👀 Ver un tablero
router.get('/:boardId', canViewBoard, (req: Request, res: Response) => {
  res.json({ message: 'Accediste al tablero' });
});

// ✏️ Editar un tablero
router.put('/:boardId', canEditBoard, (req: Request, res: Response) => {
  res.json({ message: 'Tablero editado' });
});

// 🗑️ Eliminar un tablero
router.delete('/:boardId', isOwner, (req: Request, res: Response) => {
  res.json({ message: 'Tablero eliminado' });
});

// 🤝 Compartir un tablero
router.post('/:boardId/share', isOwner, async (req: Request, res: Response) => {
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
