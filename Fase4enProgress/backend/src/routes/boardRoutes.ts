// src/routes/boardRoutes.ts
import express, { Request, Response } from 'express';
import { requireAuth } from '../middleware/authMiddleware';
import { checkBoardPermission } from '../middleware/checkBoardPermission';
import { createBoard, getBoards, shareBoard } from '../controllers/boardController';
import { deleteBoard } from '../controllers/boardController';

const router = express.Router();

// Middleware global para estas rutas
router.use(requireAuth);

// Obtener tableros del usuario logueado
router.get('/', async (req: Request, res: Response) => {
  try {
    await getBoards(req, res);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Crear tablero nuevo
router.post('/', async (req: Request, res: Response) => {
  try {
    await createBoard(req, res);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Compartir tablero
router.post('/:id/share', checkBoardPermission(['owner']), async (req: Request, res: Response) => {
  try {
    await shareBoard(req, res);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


//borrar
router.delete('/:id', checkBoardPermission(['owner']), async (req: Request, res: Response) => {
  try {
    await deleteBoard(req, res);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
