import { z } from 'zod';
import { ALLOWED_MODELS, MAX_MESSAGE_LENGTH, RATE_LIMIT_MAX_REQUESTS } from './constants';

/**
 * Shared validation schemas for user generated content.
 * TODO: Refine schemas as new fields/features appear.
 */
const roleEnum = ['user', 'assistant', 'system'] as const;

/**
 * Valida únicamente el contenido del mensaje.
 */
export const messageContentSchema = z
  .string({ required_error: 'El contenido del mensaje es obligatorio.' })
  .trim()
  .min(1, 'El mensaje no puede estar vacío.')
  .max(MAX_MESSAGE_LENGTH, `El mensaje no puede exceder ${MAX_MESSAGE_LENGTH} caracteres.`);

export const messageSchema = z
  .object({
    id: z
      .string()
      .trim()
      .min(1, 'El identificador del mensaje no puede estar vacío.')
      .max(128, 'El identificador del mensaje no puede exceder 128 caracteres.')
      .optional(),
    role: z.enum(roleEnum, { required_error: 'El rol del mensaje es obligatorio.' }),
    content: messageContentSchema,
    createdAt: z.coerce.date().optional(),
    pending: z.boolean().optional(),
  })
  .strict();

export const chatRequestSchema = z
  .object({
    messages: z
      .array(
        z
          .object({
            role: z.enum(roleEnum, { required_error: 'El rol del mensaje es obligatorio.' }),
            content: messageContentSchema,
          })
          .strict(),
      )
      .min(1, 'Debe existir al menos un mensaje.')
      .max(
        RATE_LIMIT_MAX_REQUESTS,
        `Solo se permiten los ${RATE_LIMIT_MAX_REQUESTS} mensajes más recientes por solicitud.`,
      ),
    model: z.enum(ALLOWED_MODELS as [string, ...string[]]).optional(),
  })
  .strict();

export type MessageInput = z.infer<typeof messageSchema>;
export type ChatRequestInput = z.infer<typeof chatRequestSchema>;
