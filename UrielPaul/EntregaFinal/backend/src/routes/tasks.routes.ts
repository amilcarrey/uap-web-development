// src/routes/tasks.routes.ts
import { Express } from 'express'
import { prisma, Role } from '../db'
import { authRequired } from '../auth'
import { authorize } from '../authorize'
import { validate } from '../validate'
import { taskCreateSchema, taskUpdateSchema } from '../schemas'

export function taskRoutes(app: Express): void {
  /**
   * @openapi
   * /boards/{boardId}/tasks:
   *   get:
   *     tags: [Tasks]
   *     summary: Listar tareas del tablero
   *     security: [{ cookieAuth: [] }]
   *     parameters:
   *       - name: boardId
   *         in: path
   *         required: true
   *         schema: { type: integer }
   *       - { name: page, in: query, schema: { type: integer, minimum: 1 } }
   *       - { name: size, in: query, schema: { type: integer, minimum: 1 } }
   *       - { name: completed, in: query, schema: { type: boolean } }
   *       - { name: q, in: query, schema: { type: string } }
   *     responses:
   *       200:
   *         description: Lista de tareas
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items: { $ref: '#/components/schemas/Task' }
   */
  app.get(
    '/api/boards/:boardId/tasks',
    authRequired,
    authorize(Role.VIEWER),
    async (req, res) => {
      const { page = '1', size = '10', completed, q } = req.query
      const where: any = { boardId: Number(req.params.boardId) }
      if (completed !== undefined) where.completed = completed === 'true'
      if (q) where.title = { contains: q, mode: 'insensitive' }

      const tasks = await prisma.task.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (Number(page) - 1) * Number(size),
        take: Number(size),
      })
      res.json(tasks)
    }
  )

  /**
   * @openapi
   * /boards/{boardId}/tasks:
   *   post:
   *     tags: [Tasks]
   *     summary: Crear tarea
   *     security: [{ cookieAuth: [] }]
   *     parameters:
   *       - { name: boardId, in: path, required: true, schema: { type: integer } }
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema: { $ref: '#/components/schemas/TaskCreate' }
   *     responses:
   *       201: { description: Tarea creada }
   */
  app.post(
    '/api/boards/:boardId/tasks',
    authRequired,
    authorize(Role.EDITOR),
    validate(taskCreateSchema),
    async (req, res) => {
      const task = await prisma.task.create({
    data: {
      ...req.body,
      boardId: Number(req.params.boardId),
      creatorId: req.userId!,   // 👈
    },
  })
      res.status(201).json(task)
    }
  )

  /**
   * @openapi
   * /boards/{boardId}/tasks/{taskId}:
   *   patch:
   *     tags: [Tasks]
   *     summary: Actualizar tarea
   *     security: [{ cookieAuth: [] }]
   *     parameters:
   *       - { name: boardId, in: path, required: true, schema: { type: integer } }
   *       - { name: taskId, in: path, required: true, schema: { type: integer } }
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema: { $ref: '#/components/schemas/TaskUpdate' }
   *     responses:
   *       200: { description: Tarea actualizada }
   *   delete:
   *     tags: [Tasks]
   *     summary: Eliminar tarea
   *     security: [{ cookieAuth: [] }]
   *     parameters:
   *       - { name: boardId, in: path, required: true, schema: { type: integer } }
   *       - { name: taskId, in: path, required: true, schema: { type: integer } }
   *     responses:
   *       200: { description: Tarea eliminada }
   */
  app.patch(
    '/api/boards/:boardId/tasks/:taskId',
    authRequired,
    authorize(Role.EDITOR),
    validate(taskUpdateSchema),
    async (req, res) => {
      const task = await prisma.task.update({
        where: { id: Number(req.params.taskId) },
        data: req.body,
      })
      res.json(task)
    }
  )

  app.delete(
    '/api/boards/:boardId/tasks/:taskId',
    authRequired,
    authorize(Role.EDITOR),
    async (req, res) => {
      await prisma.task.delete({ where: { id: Number(req.params.taskId) } })
      res.json({ deleted: true })
    }
  )

  /**
   * @openapi
   * /boards/{boardId}/tasks:
   *   delete:
   *     tags: [Tasks]
   *     summary: Eliminar tareas completadas en lote
   *     security: [{ cookieAuth: [] }]
   *     parameters:
   *       - { name: boardId, in: path, required: true, schema: { type: integer } }
   *       - { name: completed, in: query, required: true, schema: { type: boolean } }
   *     responses:
   *       200: { description: Cantidad eliminada }
   */
  app.delete(
    '/api/boards/:boardId/tasks',
    authRequired,
    authorize(Role.EDITOR),
    async (req, res) => {
      const completed = req.query.completed === 'true'
      const { count } = await prisma.task.deleteMany({
        where: { boardId: Number(req.params.boardId), completed },
      })
      res.json({ deleted: count })
    }
  )
}
