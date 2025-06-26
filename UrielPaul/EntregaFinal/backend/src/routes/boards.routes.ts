// src/routes/boards.routes.ts
import { Express } from 'express'
import { prisma, Role } from '../db'
import { authRequired } from '../auth'
import { authorize } from '../authorize'
import { validate } from '../validate'
import {
  boardCreateSchema,
  boardUpdateSchema,
  shareSchema,
} from '../schemas'
import { z } from 'zod'           // ← para schema del PATCH

/* Schema sencillo para cambiar sólo el rol */
const shareRoleSchema = z.object({ role: z.nativeEnum(Role) })

export function boardRoutes(app: Express): void {
  /* ───── Listar tableros ───────────────────────────────────────────── */
  app.get('/api/boards', authRequired, async (req, res) => {
    const userId = req.userId!
    const boards = await prisma.board.findMany({
      where: {
        OR: [{ ownerId: userId }, { roles: { some: { userId } } }],
      },
      include: { roles: true },
    })
    res.json(boards)
  })

  /* ───── Crear ─────────────────────────────────────────────────────── */
  app.post(
    '/api/boards',
    authRequired,
    validate(boardCreateSchema),
    async (req, res) => {
      const board = await prisma.board.create({
        data: { name: req.body.name, ownerId: req.userId! },
      })
      res.status(201).json(board)
    }
  )

  /* ───── Renombrar / Eliminar ──────────────────────────────────────── */
  app.patch(
    '/api/boards/:boardId',
    authRequired,
    authorize(Role.OWNER),
    validate(boardUpdateSchema),
    async (req, res) => {
      const board = await prisma.board.update({
        where: { id: Number(req.params.boardId) },
        data: { name: req.body.name },
      })
      res.json(board)
    }
  )

  app.delete(
    '/api/boards/:boardId',
    authRequired,
    authorize(Role.OWNER),
    async (req, res) => {
      await prisma.board.delete({ where: { id: Number(req.params.boardId) } })
      res.json({ deleted: true })
    }
  )

  /* ───── Compartir – LISTAR ────────────────────────────────────────── */
  app.get(
    '/api/boards/:boardId/share',
    authRequired,
    authorize(Role.OWNER),
    async (req, res) => {
      const users = await prisma.boardUser.findMany({
        where: { boardId: Number(req.params.boardId) },
        include: { user: true },
        orderBy: { role: 'asc' },
      })
      res.json(
        users.map(u => ({
          userId: u.userId,
          email:  u.user.email,
          role:   u.role,
        }))
      )
    }
  )

  /* ───── Compartir – AGREGAR / ACTUALIZAR ──────────────────────────── */
  app.post(
  '/api/boards/:boardId/share',
  authRequired,
  authorize(Role.OWNER),
  validate(shareSchema),
  async (req, res): Promise<void> => {      // ← Promise<void>
    const { email, role } = req.body
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' })
      return                               // ← devuelve void
    }

    await prisma.boardUser.upsert({
      where: {
        boardId_userId: {
          boardId: Number(req.params.boardId),
          userId: user.id,
        },
      },
      update: { role },
      create: {
        boardId: Number(req.params.boardId),
        userId: user.id,
        role,
      },
    })

    res.json({ shared: true })
    return                                  // ← devuelve void
  }
)

  /* ───── Compartir – CAMBIAR ROL ───────────────────────────────────── */
  app.patch(
    '/api/boards/:boardId/share/:userId',
    authRequired,
    authorize(Role.OWNER),
    validate(shareRoleSchema),
    async (req, res) => {
      await prisma.boardUser.update({
        where: {
          boardId_userId: {
            boardId: Number(req.params.boardId),
            userId: Number(req.params.userId),
          },
        },
        data: { role: req.body.role },
      })
      res.json({ updated: true })
    }
  )

  /* ───── Compartir – ELIMINAR USUARIO ──────────────────────────────── */
  app.delete(
    '/api/boards/:boardId/share/:userId',
    authRequired,
    authorize(Role.OWNER),
    async (req, res) => {
      await prisma.boardUser.delete({
        where: {
          boardId_userId: {
            boardId: Number(req.params.boardId),
            userId: Number(req.params.userId),
          },
        },
      })
      res.json({ deleted: true })
    }
  )
}
