import { Request, Response } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Esquema de validación para actualizar configuraciones
const updateSettingsSchema = z.object({
  refreshInterval: z.number().int().min(1000).optional(),
  taskViewMode: z.enum(['list', 'grid']).optional(),
});

// Obtener configuraciones del usuario
export const getSettings = async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId; // Viene de authMiddleware

  try {
    const settings = await prisma.userSettings.findUnique({
      where: { userId },
    });

    if (!settings) {
      res.status(404).json({ error: 'Configuraciones no encontradas' });
      return;
    }

    res.status(200).json({ settings, message: 'Configuraciones obtenidas exitosamente' });
  } catch (error) {
    console.error('Error al obtener configuraciones:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Actualizar configuraciones del usuario
export const updateSettings = async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId; // Viene de authMiddleware

  try {
    const parsedData = updateSettingsSchema.parse(req.body);

    const settings = await prisma.userSettings.update({
      where: { userId },
      data: parsedData,
    });

    res.status(200).json({ settings, message: 'Configuraciones actualizadas exitosamente' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    console.error('Error al actualizar configuraciones:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};