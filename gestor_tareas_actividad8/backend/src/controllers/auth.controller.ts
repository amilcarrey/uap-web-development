import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { generarToken } from '../utils/jwt';


const prisma = new PrismaClient();

export async function register(req: Request, res: Response): Promise<void> {
  const { email, password, name } = req.body;

  const existe = await prisma.user.findUnique({ where: { email } });
  if (existe) {
  res.status(409).json({ error: 'El email ya está registrado' });
  return;
}


  const hashed = await bcrypt.hash(password, 10);
  const nuevo = await prisma.user.create({
    data: { email, password: hashed, name }
  });

  res.status(201).json({ message: 'Usuario creado correctamente' });
}

export async function login(req: Request, res: Response): Promise<void> {

  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(401).json({ error: 'Credenciales inválidas' });
    return;
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    res.status(401).json({ error: 'Credenciales inválidas' });
  return;
}

  const token = generarToken({ id: user.id, email: user.email });

  res
    .cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    })
    .json({ message: 'Login exitoso' });
}

export async function logout(_req: Request, res: Response): Promise<void> {
  res.clearCookie('token').json({ message: 'Sesión cerrada' });
}
