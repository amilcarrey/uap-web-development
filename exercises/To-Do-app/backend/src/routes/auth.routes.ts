import { Router, Request, Response } from 'express';
import { register, login, logout } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import prisma from '../prisma';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authMiddleware, (req: Request, res: Response) => {
  res.json({ message: 'Usuario autenticado', user: (req as any).user });
});
router.get('/test-db', async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json({ message: 'Conexión a la base de datos exitosa', users });
  } catch (error) {
    console.error('Error en test-db:', error);
    res.status(500).json({ error: 'Error en la base de datos', details: error instanceof Error ? error.message : 'Unknown error' });
  }
});

export default router;