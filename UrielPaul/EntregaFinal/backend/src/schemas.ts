// src/schemas.ts
import { z } from 'zod'
import { Role } from './db'   // para usar enum de Prisma

/* ───── Auth ──────────────────────────────────────────────────────────── */
export const registerSchema = z.object({
  email:    z.string().email(),
  name:     z.string().min(1),
  password: z.string().min(6),
})

export const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(6),
})

/* ───── Boards ────────────────────────────────────────────────────────── */
export const boardCreateSchema = z.object({
  name: z.string().min(1),
})

export const boardUpdateSchema = boardCreateSchema  // mismo shape

export const shareSchema = z.object({
  email: z.string().email(),
  role:  z.nativeEnum(Role).refine(r => r !== Role.OWNER, { message: 'No puedes asignar OWNER' }),
})

/* ───── Tasks ─────────────────────────────────────────────────────────── */
export const taskCreateSchema = z.object({
  title:   z.string().min(1),
  content: z.string().optional(),
})

export const taskUpdateSchema = z.object({
  title:     z.string().min(1).optional(),
  content:   z.string().optional(),
  completed: z.boolean().optional(),
})

/* ───── Preferences ───────────────────────────────────────────────────── */
export const prefSchema = z.object({
  autoRefreshInterval: z.number().int().positive().optional(),
  taskView: z.enum(['grid', 'list']).optional(),
})
