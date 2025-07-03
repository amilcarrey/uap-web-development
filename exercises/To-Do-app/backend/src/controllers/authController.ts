import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { registerSchema, loginSchema } from '../utils/validate';

const prisma = new PrismaClient();

// Registro
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: result.error.errors });
      return;
    }

    const { email, password, name } = result.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: 'El email ya está registrado' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });

    await prisma.userSettings.create({
      data: { userId: user.id, refreshInterval: 60000, taskViewMode: 'list' },
    });

    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: result.error.errors });
      return;
    }

    const { email, password } = result.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000,
    });

    res.json({ message: 'Login exitoso' });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Logout
export const logout = (req: Request, res: Response): void => {
  res.clearCookie('token');
  res.json({ message: 'Logout exitoso' });
};