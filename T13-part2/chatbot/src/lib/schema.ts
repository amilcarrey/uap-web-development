import { z } from "zod";

export const chatMessageSchema = z.object({
  id: z.string().min(1).optional(),
  role: z.enum(["user", "assistant", "system", "tool"]).default("user"),
  content: z.string().max(8000), // Permitir content vacío para mensajes de tool
  toolCallId: z.string().optional(), // Para tool calling
  toolInvocations: z.array(z.any()).optional(), // Para tool calling
});

export const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1),
  sessionId: z.string().min(1).max(128).optional(),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type ChatRequest = z.infer<typeof chatRequestSchema>;
