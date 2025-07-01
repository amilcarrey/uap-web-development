import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Obtener información del usuario autenticado
export async function me(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ error: 'No autenticado' });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
  });

  if (!user) {
    res.status(404).json({ error: 'Usuario no encontrado' });
    return;
  }

  res.json(user);
}

// Actualizar preferencias del usuario
export async function updateSettings(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ error: 'No autenticado' });
    return;
  }

  const { refetchInterval, uppercaseDescriptions } = req.body;

  if (refetchInterval !== undefined && typeof refetchInterval !== 'number') {
    res.status(400).json({ error: 'refetchInterval debe ser un número' });
    return;
  }

  if (uppercaseDescriptions !== undefined && typeof uppercaseDescriptions !== 'boolean') {
    res.status(400).json({ error: 'uppercaseDescriptions debe ser booleano' });
    return;
  }

  try {
    const settings = await prisma.userSettings.upsert({
      where: { userId },
      update: { refetchInterval, uppercaseDescriptions },
      create: {
        userId,
        refetchInterval: refetchInterval ?? 10,
        uppercaseDescriptions: uppercaseDescriptions ?? false,
      },
    });

    res.json(settings);
  } catch (error) {
    console.error('Error al actualizar configuración:', error);
    res.status(500).json({ error: 'Error al actualizar configuración del usuario' });
  }
}
