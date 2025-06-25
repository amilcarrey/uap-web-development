import dotenv from 'dotenv'
dotenv.config()
import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { randomUUID } from 'crypto'
import db from '../db'
import { Usuario } from '../models/usuario'

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET no definido')
}

export const registrarUsuario = async (req: Request, res: Response): Promise<void> => {
  // agarro datos del body
  const { nombre, email, contraseña } = req.body

  // si falta algo, corto
  if (!nombre || !email || !contraseña) {
    res.status(400).json({ error: 'Faltan datos' })
    return
  }

  // veo si ya existe ese mail
  const existente = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email)
  if (existente) {
    res.status(409).json({ error: 'El email ya está registrado' })
    return
  }

  // hasheo la contraseña y guardo el user
  const hash = await bcrypt.hash(contraseña, 10)
  const id = randomUUID()

  db.prepare(
    'INSERT INTO usuarios (id, nombre, email, password) VALUES (?, ?, ?, ?)'
  ).run(id, nombre, email, hash)

  res.status(201).json({ id, nombre, email })
}

export const loginUsuario = async (req: Request, res: Response): Promise<void> => {
  // agarro datos del body
  const { email, contraseña } = req.body

  // si falta algo, corto
  if (!email || !contraseña) {
    res.status(400).json({ error: 'Faltan datos' })
    return
  }

  // busco el usuario por mail
  const usuario = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email) as Usuario

  // si no existe, chau
  if (!usuario) {
    res.status(401).json({ error: 'Credenciales inválidas' })
    return
  }

  // comparo la contraseña
  const coincide = await bcrypt.compare(contraseña, usuario.password)
  if (!coincide) {
    res.status(401).json({ error: 'Credenciales inválidas' })
    return
  }

  // armo el token
  const token = jwt.sign(
    { id: usuario.id, nombre: usuario.nombre, email: usuario.email },
    JWT_SECRET,
    { expiresIn: '2h' }
  )

  // mando cookie con el token
  res
    .cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 2 * 60 * 60 * 1000,
    })
    .json({ mensaje: 'Inicio de sesión exitoso' })
}

export const logoutUsuario = (req: Request, res: Response) => {
  // borro la cookie y chau sesión
  res.clearCookie('token').json({ mensaje: 'Sesión cerrada' })
}