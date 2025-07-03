// 📁 src/routes/tareas.js
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middlewares/auth.js';

const prisma = new PrismaClient();
const router = express.Router();

router.use(requireAuth);

router.get('/', async (req, res) => {
  const { tableroId, estado, q, page = 1 } = req.query;
  const take = 10;
  const skip = (page - 1) * take;

  const where = {
    tableroId: Number(tableroId),
    ...(estado && {
      completada: estado === 'completada',
    }),
    ...(q && {
      contenido: { contains: q, mode: 'insensitive' },
    }),
  };

  const tareas = await prisma.tarea.findMany({
    where,
    take,
    skip,
  });
  res.json(tareas);
});

router.post('/', async (req, res) => {
  const { contenido, tableroId } = req.body;
  const tarea = await prisma.tarea.create({
    data: { contenido, tableroId },
  });
  res.status(201).json(tarea);
});

router.patch('/:id', async (req, res) => {
  const tarea = await prisma.tarea.update({
    where: { id: Number(req.params.id) },
    data: req.body,
  });
  res.json(tarea);
});

router.delete('/:id', async (req, res) => {
  await prisma.tarea.delete({ where: { id: Number(req.params.id) } });
  res.status(204).end();
});

router.delete('/completadas', async (req, res) => {
  const { tableroId } = req.query;
  await prisma.tarea.deleteMany({ where: { tableroId: Number(tableroId), completada: true } });
  res.status(204).end();
});

export default router;