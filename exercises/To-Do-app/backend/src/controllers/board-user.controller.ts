import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../prisma';

// Definir un tipo local para los roles
type Role = 'owner' | 'editor' | 'viewer';

// Esquema de validación para añadir un usuario a un tablero
const addUserSchema = z.object({
  userId: z.number().int().positive('El ID del usuario debe ser un número positivo'),
  role: z.enum(['owner', 'editor', 'viewer'], { message: 'Rol inválido' }),
});

// Esquema de validación para actualizar el rol de un usuario
const updateUserRoleSchema = z.object({
  role: z.enum(['owner', 'editor', 'viewer'], { message: 'Rol inválido' }),
});

// Añadir un usuario a un tablero
export const addUserToBoard = async (req: Request, res: Response): Promise<void> => {
  try {
    const boardId = parseInt(req.params.boardId);
    const { userId, role } = addUserSchema.parse(req.body);
    const currentUserId = (req as any).user.id;

    // Verificar si el usuario actual es owner del tablero
    const currentBoardUser = await prisma.boardUser.findUnique({
      where: {
        userId_boardId: { userId: currentUserId, boardId },
      },
    });

    if (!currentBoardUser || currentBoardUser.role !== 'owner') {
      res.status(403).json({ error: 'No tienes permiso para añadir usuarios a este tablero' });
      return;
    }

    // Verificar si el usuario existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    // Verificar si el usuario ya está en el tablero
    const existingBoardUser = await prisma.boardUser.findUnique({
      where: {
        userId_boardId: { userId, boardId },
      },
    });

    if (existingBoardUser) {
      res.status(400).json({ error: 'El usuario ya está asignado a este tablero' });
      return;
    }

    // Añadir el usuario al tablero
    const boardUser = await prisma.boardUser.create({
      data: {
        userId,
        boardId,
        role,
      },
    });

    res.status(201).json({ message: 'Usuario añadido al tablero', boardUser });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    res.status(500).json({ error: 'Error al añadir el usuario al tablero' });
  }
};

// Listar usuarios de un tablero
export const getBoardUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const boardId = parseInt(req.params.boardId);
    const userId = (req as any).user.id;

    // Verificar si el usuario tiene acceso al tablero
    const boardUser = await prisma.boardUser.findUnique({
      where: {
        userId_boardId: { userId, boardId },
      },
    });

    if (!boardUser) {
      res.status(403).json({ error: 'No tienes acceso a este tablero' });
      return;
    }

    const boardUsers = await prisma.boardUser.findMany({
      where: { boardId },
      include: { user: true },
    });

    res.json({ message: 'Lista de usuarios del tablero', boardUsers });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los usuarios del tablero' });
  }
};

// Actualizar el rol de un usuario en un tablero
export const updateBoardUserRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const boardId = parseInt(req.params.boardId);
    const userId = parseInt(req.params.userId);
    const currentUserId = (req as any).user.id;
    const { role } = updateUserRoleSchema.parse(req.body);

    // Verificar si el usuario actual es owner del tablero
    const currentBoardUser = await prisma.boardUser.findUnique({
      where: {
        userId_boardId: { userId: currentUserId, boardId },
      },
    });

    if (!currentBoardUser || currentBoardUser.role !== 'owner') {
      res.status(403).json({ error: 'No tienes permiso para actualizar roles en este tablero' });
      return;
    }

    // Verificar si el usuario objetivo está en el tablero
    const boardUser = await prisma.boardUser.findUnique({
      where: {
        userId_boardId: { userId, boardId },
      },
    });

    if (!boardUser) {
      res.status(404).json({ error: 'Usuario no encontrado en este tablero' });
      return;
    }

    // Actualizar el rol
    const updatedBoardUser = await prisma.boardUser.update({
      where: {
        userId_boardId: { userId, boardId },
      },
      data: { role },
    });

    res.json({ message: 'Rol actualizado', boardUser: updatedBoardUser });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    res.status(500).json({ error: 'Error al actualizar el rol' });
  }
};

// Eliminar un usuario de un tablero
export const removeUserFromBoard = async (req: Request, res: Response): Promise<void> => {
  try {
    const boardId = parseInt(req.params.boardId);
    const userId = parseInt(req.params.userId);
    const currentUserId = (req as any).user.id;

    // Verificar si el usuario actual es owner del tablero
    const currentBoardUser = await prisma.boardUser.findUnique({
      where: {
        userId_boardId: { userId: currentUserId, boardId },
      },
    });

    if (!currentBoardUser || currentBoardUser.role !== 'owner') {
      res.status(403).json({ error: 'No tienes permiso para eliminar usuarios de este tablero' });
      return;
    }

    // Verificar si el usuario objetivo está en el tablero
    const boardUser = await prisma.boardUser.findUnique({
      where: {
        userId_boardId: { userId, boardId },
      },
    });

    if (!boardUser) {
      res.status(404).json({ error: 'Usuario no encontrado en este tablero' });
      return;
    }

    // Evitar que un owner se elimine a sí mismo
    if (userId === currentUserId) {
      res.status(400).json({ error: 'No puedes eliminarte a ti mismo como propietario' });
      return;
    }

    await prisma.boardUser.delete({
      where: {
        userId_boardId: { userId, boardId },
      },
    });

    res.json({ message: 'Usuario eliminado del tablero' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el usuario del tablero' });
  }
};