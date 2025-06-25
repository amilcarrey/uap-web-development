import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import db from '../db'
import { Usuario } from '../models/usuario'
import 'express'

interface JwtPayload {
  id: string
  nombre: string
  email: string
}

export const protegerRuta = (req: Request, res: Response, next: NextFunction): any => {
  // agarro el token de la cookie
  const token = req.cookies?.token

  if (!token) {
    return res.status(401).json({ error: 'Token requerido (cookie)' })
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET
    if (!JWT_SECRET) throw new Error('JWT_SECRET no está definido')

    // decodifico el token
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload

    if (!decoded?.id) {
      return res.status(401).json({ error: 'Token inválido o malformado' })
    }

    // busco el usuario en la base
    const usuario = db.prepare('SELECT * FROM usuarios WHERE id = ?').get(decoded.id) as Usuario

    if (!usuario) {
      return res.status(401).json({ error: 'Usuario no encontrado' })
    }

    // lo guardo en req para usar después
    req.usuario = usuario
    next()
  } catch (error) {
    console.error('❌ Error al verificar token:', error)
    res.status(401).json({ error: 'Token inválido', detalle: (error as Error).message })
  }
}

