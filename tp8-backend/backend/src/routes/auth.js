// 📁 src/routes/auth.js
import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { requireAuth } from '../middlewares/auth.js';

const prisma = new PrismaClient();
const router = express.Router();

router.post('/registro', async (req, res) => {
  const { email, password, nombre } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const usuario = await prisma.usuario.create({
      data: { email, password: hash, nombre },
    });
    res.status(201).json(usuario);
  } catch (e) {
    res.status(400).json({ error: 'Error al registrar usuario' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const usuario = await prisma.usuario.findUnique({ where: { email } });
  if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }
  const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET);
  res.cookie('token', token, { httpOnly: true }).json({ message: 'Login exitoso' });
});

router.get('/logout', (req, res) => {
  res.clearCookie('token').json({ message: 'Logout exitoso' });
});

router.get('/perfil', requireAuth, async (req, res) => {
  res.json(req.usuario);
});

export default router;