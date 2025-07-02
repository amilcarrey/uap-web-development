import { Router, type Request, type Response, type NextFunction } from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Obtener configuraciones del usuario autenticado
router.get(
  '/',
  isAuthenticated,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user?.id;

    try {
      const settings = await prisma.userSettings.findUnique({
        where: { userId },
      });

      if (!settings) {
        res.status(404).json({ error: 'Configuraciones no encontradas' });
        return;
      }

      res.json(settings);
    } catch (error) {
      console.error('Error al obtener configuraciones:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

// Actualizar configuraciones del usuario autenticado
router.put(
  '/',
  isAuthenticated,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }

    const { refetchInterval, uppercaseDescriptions } = req.body;

    if (typeof refetchInterval !== 'number' || typeof uppercaseDescriptions !== 'boolean') {
      res.status(400).json({ error: 'Datos inválidos' });
      return;
    }

    try {
      const updatedSettings = await prisma.userSettings.upsert({
        where: { userId },
        update: {
          refetchInterval,
          uppercaseDescriptions,
          updatedAt: new Date(),
        },
        create: {
          userId,
          refetchInterval,
          uppercaseDescriptions,
        },
      });

      res.json(updatedSettings);
    } catch (error) {
      console.error('Error al actualizar configuraciones:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

export default router;
