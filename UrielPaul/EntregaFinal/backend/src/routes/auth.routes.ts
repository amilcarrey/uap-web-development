// src/routes/auth.routes.ts
import type { Express } from "express"
import jwt from "jsonwebtoken"
import { prisma } from "../db"
import { validate } from "../validate"
import { registerSchema, loginSchema } from "../schemas"
import { authRequired } from "../auth"

const signToken = (id: number) =>
  jwt.sign({}, process.env.JWT_SECRET!, {
    expiresIn: "7d",
    subject: id.toString(),
  })

export function authRoutes(app: Express): void {
  /**
   * @openapi
   * /auth/register:
   *   post:
   *     tags: [Auth]
   *     summary: Registrar usuario
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema: { $ref: '#/components/schemas/RegisterBody' }
   *     responses:
   *       201: { description: Usuario creado }
   *       409: { description: Email en uso }
   */
  app.post("/api/auth/register", validate(registerSchema), async (req, res) => {
    const { email, name, password } = req.body
    const bcrypt = await import("bcrypt")
    const hash = await bcrypt.hash(password, 12)

    try {
      const user = await prisma.user.create({ data: { email, name, passwordHash: hash } })
      const token = signToken(user.id)
      res.cookie("token", token, { httpOnly: true, sameSite: "lax" })
      res.status(201).json({ id: user.id, email: user.email })
    } catch (error) {
      res.status(409).json({ message: "Email en uso" })
    }
  })

  /**
   * @openapi
   * /auth/login:
   *   post:
   *     tags: [Auth]
   *     summary: Iniciar sesión
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema: { $ref: '#/components/schemas/LoginBody' }
   *     responses:
   *       200: { description: Sesión iniciada }
   *       401: { description: Credenciales inválidas }
   */
  app.post("/api/auth/login", validate(loginSchema), async (req, res) => {
    const { email, password } = req.body
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      res.status(401).json({ message: "Credenciales inválidas" })
      return
    }

    const bcrypt = await import("bcrypt")
    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) {
      res.status(401).json({ message: "Credenciales inválidas" })
      return
    }

    const token = signToken(user.id)
    res.cookie("token", token, { httpOnly: true, sameSite: "lax" })
    res.json({ id: user.id, email: user.email })
  })

  /**
   * @openapi
   * /auth/logout:
   *   post:
   *     tags: [Auth]
   *     summary: Cerrar sesión
   *     security: [{ cookieAuth: [] }]
   *     responses:
   *       200: { description: Sesión cerrada }
   */
  app.post("/api/auth/logout", authRequired, (_req, res) => {
    res.clearCookie("token")
    res.json({ message: "Bye!" })
  })

  // Endpoint to get current user data
  app.get("/api/auth/me", authRequired, async (req, res) => {
    const user = await prisma.user.findUnique({
      where: { id: req.userId! },
      select: { id: true, email: true, name: true },
    })
    res.json(user)
  })
}
