// 📁 src/routes/permisos.js
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middlewares/auth.js';

const prisma = new PrismaClient();
const router = express.Router();

router.use(requireAuth);

router.post('/', async (req, res) => {
  const { tableroId, usuarioEmail, rol } = req.body;
  const usuario = await prisma.usuario.findUnique({ where: { email: usuarioEmail } });
  if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
  const permiso = await prisma.permiso.create({
    data: {
      tableroId,
      usuarioId: usuario.id,
      rol,
    },
  });
  res.status(201).json(permiso);
});

router.get('/', async (req, res) => {
  const { tableroId } = req.query;
  const permisos = await prisma.permiso.findMany({
    where: { tableroId: Number(tableroId) },
    include: { usuario: true },
  });
  res.json(permisos);
});

router.delete('/:id', async (req, res) => {
  await prisma.permiso.delete({ where: { id: Number(req.params.id) } });
  res.status(204).end();
});

export default router;