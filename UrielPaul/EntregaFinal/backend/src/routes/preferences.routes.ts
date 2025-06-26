// src/routes/preferences.routes.ts
import { Express } from 'express'
import { prisma } from '../db'
import { authRequired } from '../auth'
import { validate } from '../validate'
import { prefSchema } from '../schemas'

export function preferenceRoutes(app: Express): void {
  /**
   * @openapi
   * /preferences:
   *   get:
   *     tags: [Preferences]
   *     summary: Obtener preferencias del usuario
   *     security: [{ cookieAuth: [] }]
   *     responses:
   *       200:
   *         description: Objeto de preferencias o `null`
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/PreferencesBody'
   *   put:
   *     tags: [Preferences]
   *     summary: Guardar preferencias
   *     security: [{ cookieAuth: [] }]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema: { $ref: '#/components/schemas/PreferencesBody' }
   *     responses:
   *       200: { description: Preferencias guardadas }
   */
  app.get('/api/preferences', authRequired, async (req, res) => {
    const pref = await prisma.preference.findUnique({
      where: { userId: req.userId! },
    })
    res.json(pref)
  })

  app.put(
    '/api/preferences',
    authRequired,
    validate(prefSchema),
    async (req, res) => {
      const pref = await prisma.preference.upsert({
        where: { userId: req.userId! },
        update: req.body,
        create: { ...req.body, userId: req.userId! },
      })
      res.json(pref)
    }
  )
}
