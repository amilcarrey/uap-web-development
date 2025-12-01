// 📁 src/routes/tareas.js
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middlewares/auth.js';

const prisma = new PrismaClient();
const router = express.Router();

// Middleware de autenticación
router.use(requireAuth);

// ✅ GET /api/tareas
router.get('/', async (req, res) => {
  try {
    const { tableroId, estado, q, page = 1 } = req.query;

    if (!tableroId) {
      return res.status(400).json({ error: 'El parámetro tableroId es requerido' });
    }

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
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    res.status(500).json({ error: 'Error interno al obtener tareas' });
  }
});

// ✅ POST /api/tareas
router.post('/', async (req, res) => {
  try {
    const { contenido, tableroId } = req.body;

    if (!contenido || !tableroId) {
      return res.status(400).json({ error: 'Contenido y tableroId son obligatorios' });
    }

    const tablero = await prisma.tablero.findUnique({
      where: { id: Number(tableroId) },
    });

    if (!tablero || tablero.usuarioId !== req.user.id) {
      return res.status(403).json({ error: 'No tienes acceso a este tablero' });
    }

    const tarea = await prisma.tarea.create({
      data: {
        contenido,
        tableroId: Number(tableroId),
      },
    });

    res.status(201).json(tarea);
  } catch (error) {
    console.error('Error al crear tarea:', error);
    res.status(500).json({ error: 'Error interno al crear tarea' });
  }
});

// ✅ PATCH /api/tareas/:id
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const tareaExistente = await prisma.tarea.findUnique({
      where: { id: Number(id) },
      include: { tablero: true },
    });

    if (!tareaExistente || tareaExistente.tablero.usuarioId !== req.user.id) {
      return res.status(403).json({ error: 'No tienes acceso a esta tarea' });
    }

    const tarea = await prisma.tarea.update({
      where: { id: Number(id) },
      data: req.body,
    });

    res.json(tarea);
  } catch (error) {
    console.error('Error al editar tarea:', error);
    res.status(500).json({ error: 'Error al editar tarea' });
  }
});

// ✅ DELETE /api/tareas/:id
router.delete('/:id', async (req, res) => {
  try {
    const tarea = await prisma.tarea.findUnique({
      where: { id: Number(req.params.id) },
      include: { tablero: true },
    });

    if (!tarea || tarea.tablero.usuarioId !== req.user.id) {
      return res.status(403).json({ error: 'No tienes acceso a esta tarea' });
    }

    await prisma.tarea.delete({ where: { id: Number(req.params.id) } });
    res.status(204).end();
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    res.status(500).json({ error: 'Error al eliminar tarea' });
  }
});

// ✅ DELETE /api/tareas/completadas
router.delete('/completadas', async (req, res) => {
  try {
    const { tableroId } = req.query;

    if (!tableroId) {
      return res.status(400).json({ error: 'El parámetro tableroId es requerido' });
    }

    const tablero = await prisma.tablero.findUnique({
      where: { id: Number(tableroId) },
    });

    if (!tablero || tablero.usuarioId !== req.user.id) {
      return res.status(403).json({ error: 'No tienes acceso a este tablero' });
    }

    await prisma.tarea.deleteMany({
      where: {
        tableroId: Number(tableroId),
        completada: true,
      },
    });

    res.status(204).end();
  } catch (error) {
    console.error('Error al eliminar tareas completadas:', error);
    res.status(500).json({ error: 'Error al eliminar tareas completadas' });
  }
});

export default router;
