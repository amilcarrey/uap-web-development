import { z } from 'zod';

export const createTaskSchema = z.object({
  body: z.object({
    text: z.string().min(1, 'El texto es obligatorio'),
  }),
  params: z.object({
    boardId: z.string().uuid(),
  }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    text: z.string().optional(),
    completed: z.boolean().optional(),
  }),
  params: z.object({
    taskId: z.string().uuid(),
  }),
});

export const taskIdParamSchema = z.object({
  taskId: z.string().uuid('ID de tarea inválido'),
});

export const boardIdParamSchema = z.object({
  boardId: z.string().uuid('El ID del tablero debe ser un UUID válido'),
});
