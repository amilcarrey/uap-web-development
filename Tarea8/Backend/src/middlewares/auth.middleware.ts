import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret'

export interface AuthRequest extends Request {
  userId?: number
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token
  if (!token) {
    res.status(401).json({ message: 'No autenticado' })
    return // <-- solo return, NO return res.status...
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: number }
    req.userId = payload.userId
    next()
  } catch {
    res.status(401).json({ message: 'Token inválido o expirado' })
    return // <-- solo return, NO return res.status...
  }
}