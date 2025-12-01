import { Request, Response } from 'express';
import { ChatService } from './chat.service';
import { toString } from 'express-validator/lib/utils';

// Función para sanitizar strings
const sanitizeString = (str: string): string => {
    return String(str)
        .trim()
        .slice(0, 5000)
        .replace(/[<>]/g, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '');
};

// Validar estructura de mensaje
interface MessageInput {
    role: string;
    content: string;
}

const isValidMessage = (msg: any): msg is MessageInput => {
    return (
        typeof msg === 'object' &&
        msg !== null &&
        typeof msg.role === 'string' &&
        typeof msg.content === 'string' &&
        ['user', 'assistant'].includes(msg.role) &&
        msg.content.trim().length > 0 &&
        msg.content.trim().length <= 5000
    );
};

export class ChatController {
    private chatService = new ChatService();

    async chat(req: Request, res: Response) {
        try {
            const { messages, conversationId, boardId } = req.body;
            const user_id = req.user?.id;

            const userId = toString(user_id);

            if (!userId) {
                return res.status(401).json({ error: 'Usuario no autenticado' });
            }

            // Validar que messages sea un array
            if (!Array.isArray(messages) || messages.length === 0) {
                return res.status(400).json({ error: 'Messages debe ser un array no vacío' });
            }

            // Validar que no haya más de 100 mensajes en el historial
            if (messages.length > 100) {
                return res.status(400).json({ error: 'Historial de mensajes muy largo' });
            }

            // Validar que todos los mensajes sean válidos
            const invalidMessages = messages.filter(msg => !isValidMessage(msg));
            if (invalidMessages.length > 0) {
                return res.status(400).json({ error: 'Uno o más mensajes son inválidos' });
            }

            // Validar boardId si está presente
            if (boardId !== undefined && (typeof boardId !== 'number' || boardId < 0)) {
                return res.status(400).json({ error: 'boardId debe ser un número no negativo' });
            }

            // Validar conversationId si está presente
            if (conversationId !== undefined && typeof conversationId !== 'string') {
                return res.status(400).json({ error: 'conversationId debe ser un string' });
            }

            // Sanitizar contenido de los mensajes
            const sanitizedMessages = messages.map(msg => ({
                role: msg.role,
                content: sanitizeString(msg.content)
            }));

            // Obtener respuesta del LLM con tools
            const response = await this.chatService.processMessage(
                userId,
                sanitizedMessages,
                boardId,
                conversationId
            );

            res.json(response);
        } catch (error) {
            console.error('Chat error:', error);
            res.status(500).json({ 
                error: 'Error procesando el mensaje',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    async executeTool(req: Request, res: Response) {
        try {
            const { toolName } = req.params;
            const { params } = req.body;
            const user_id = req.user?.id;

            const userId = toString(user_id);

            if (!userId) {
                return res.status(401).json({ error: 'Usuario no autenticado' });
            }

            // Validar toolName
            const validTools = [
                'createTask',
                'updateTask',
                'toggleTask',
                'deleteTask',
                'searchTasks',
                'getTaskStats',
                'clearCompletedTasks'
            ];

            if (!validTools.includes(toolName)) {
                return res.status(400).json({ error: 'Tool no válida' });
            }

            // Validar params
            if (!params || typeof params !== 'object') {
                return res.status(400).json({ error: 'Parámetros inválidos' });
            }

            // Sanitizar parámetros string
            const sanitizedParams: any = {};
            for (const [key, value] of Object.entries(params)) {
                if (typeof value === 'string') {
                    sanitizedParams[key] = sanitizeString(value);
                } else {
                    sanitizedParams[key] = value;
                }
            }

            const result = await this.chatService.executeTool(
                userId,
                toolName,
                sanitizedParams
            );

            res.json(result);
        } catch (error) {
            console.error('Tool execution error:', error);
            res.status(500).json({ 
                error: 'Error ejecutando la herramienta',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
}