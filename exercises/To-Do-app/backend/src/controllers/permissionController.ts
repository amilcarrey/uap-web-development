import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Esquema de validación para crear un permiso
const createPermissionSchema = z.object({
  userId: z.number().int().positive('El ID del usuario debe ser un número positivo'),
  role: z.enum(['owner', 'editor', 'reader'], { message: 'Rol inválido' }),
});

// Crear un permiso
export const createPermission = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: 'No autorizado: usuario no identificado' });
      return;
    }

    const boardId = parseInt(req.params.id);
    const { userId: targetUserId, role } = createPermissionSchema.parse(req.body);

    // Verificar que el usuario sea el propietario del tablero
    const permission = await prisma.permission.findFirst({
      where: { boardId, userId, role: 'owner' },
    });
    if (!permission) {
      res.status(403).json({ error: 'No autorizado: solo el propietario puede asignar permisos' });
      return;
    }

    // Verificar que el usuario objetivo exista
    const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!targetUser) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    // Verificar si ya existe un permiso
    const existingPermission = await prisma.permission.findFirst({
      where: { boardId, userId: targetUserId },
    });
    if (existingPermission) {
      res.status(400).json({ error: 'El usuario ya tiene un permiso para este tablero' });
      return;
    }

    const newPermission = await prisma.permission.create({
      data: {
        userId: targetUserId,
        boardId,
        role,
      },
    });

    res.status(201).json({ permission: newPermission, message: 'Permiso asignado exitosamente' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      console.error('Error al asignar permiso:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
};

// Listar permisos de un tablero
export const getPermissions = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: 'No autorizado: usuario no identificado' });
      return;
    }

    const boardId = parseInt(req.params.id);

    // Verificar que el usuario sea el propietario del tablero
    const permission = await prisma.permission.findFirst({
      where: { boardId, userId, role: 'owner' },
    });
    if (!permission) {
      res.status(403).json({ error: 'No autorizado: solo el propietario puede ver los permisos' });
      return;
    }

    const permissions = await prisma.permission.findMany({
      where: { boardId },
      include: { user: { select: { id: true, email: true, name: true } } },
    });

    res.status(200).json({ permissions, message: permissions.length ? 'Permisos encontrados' : 'No hay permisos asignados' });
  } catch (error) {
    console.error('Error al obtener permisos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Eliminar un permiso
export const deletePermission = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: 'No autorizado: usuario no identificado' });
      return;
    }

    const boardId = parseInt(req.params.id);
    const targetUserId = parseInt(req.params.userId);

    // Verificar que el usuario sea el propietario del tablero
    const permission = await prisma.permission.findFirst({
      where: { boardId, userId, role: 'owner' },
    });
    if (!permission) {
      res.status(403).json({ error: 'No autorizado: solo el propietario puede eliminar permisos' });
      return;
    }

    const targetPermission = await prisma.permission.findFirst({
      where: { boardId, userId: targetUserId },
    });
    if (!targetPermission) {
      res.status(404).json({ error: 'Permiso no encontrado' });
      return;
    }

    await prisma.permission.delete({
      where: { id: targetPermission.id },
    });

    res.status(200).json({ message: 'Permiso eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar permiso:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};