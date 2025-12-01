import { Router, Request, Response, NextFunction } from 'express';
import { ChatController } from '../modules/chat/chat.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();
const chatController = new ChatController();

// Wrapper para que el middleware no retorne nada
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    authenticateToken(req, res, next);
};

/**
 * POST /api/chat
 * Enviar mensaje al chatbot con soporte para tool calling
 */
router.post('/', authMiddleware, (req: Request, res: Response) => {
    chatController.chat(req, res);
});

/**
 * POST /api/chat/tools/:toolName
 * Ejecutar una herramienta específica directamente
 */
router.post('/tools/:toolName', authMiddleware, (req: Request, res: Response) => {
    chatController.executeTool(req, res);
});

export default router;