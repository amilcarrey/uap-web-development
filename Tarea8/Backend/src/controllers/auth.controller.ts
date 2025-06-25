import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret'

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body
  if (!name || !email || !password) {
    res.status(400).json({ message: 'Faltan datos' })
    return
  }
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    res.status(409).json({ message: 'El email ya está registrado' })
    return
  }
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { name, email, passwordHash }
  })
  res.status(201).json({ id: user.id, name: user.name, email: user.email })
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400).json({ message: 'Faltan datos' })
    return
  }
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    res.status(401).json({ message: 'Credenciales inválidas' })
    return
  }
  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) {
    res.status(401).json({ message: 'Credenciales inválidas' })
    return
  }
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1d' })
  res.cookie('token', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000
  })
  res.json({ id: user.id, name: user.name, email: user.email })
}

export const logout = (_req: Request, res: Response) => {
  res.clearCookie('token')
  res.json({ message: 'Sesión cerrada' })
  return
}