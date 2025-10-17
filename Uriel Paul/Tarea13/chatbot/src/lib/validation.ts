import { z } from 'zod';
import { ALLOWED_MODELS, MAX_MESSAGE_LENGTH } from './constants';

/**
 * Shared validation schemas for user generated content.
 * TODO: Refine schemas as new fields/features appear.
 */
export const messageSchema = z.object({
  id: z.string().optional(),
  role: z.enum(['user', 'assistant', 'system']),
  content: z
    .string()
    .trim()
    .min(1, 'El mensaje no puede estar vacío.')
    .max(MAX_MESSAGE_LENGTH, `El mensaje no puede exceder ${MAX_MESSAGE_LENGTH} caracteres.`),
  createdAt: z.coerce.date().optional(),
  pending: z.boolean().optional(),
});

export const chatRequestSchema = z.object({
  messages: z.array(messageSchema).min(1, 'Debe existir al menos un mensaje.'),
  model: z.enum(ALLOWED_MODELS as [string, ...string[]]),
});

export type MessageInput = z.infer<typeof messageSchema>;
export type ChatRequestInput = z.infer<typeof chatRequestSchema>;
