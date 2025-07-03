// middleware/auth.js
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const requireAuth = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'No autenticado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await prisma.usuario.findUnique({ where: { id: decoded.id } });
    if (!usuario) return res.status(401).json({ error: 'Usuario no válido' });
    req.usuario = usuario;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido' });
  }
};
