// 📁 src/routes/tableros.js
import express from 'express';
import { PrismaClient, Rol } from '@prisma/client';
import { requireAuth } from '../middlewares/auth.js';

const prisma = new PrismaClient();
const router = express.Router();

router.use(requireAuth);

router.get('/', async (req, res) => {
  const tableros = await prisma.tablero.findMany({
    where: {
      permisos: {
        some: { usuarioId: req.usuario.id },
      },
    },
    include: { permisos: true },
  });
  res.json(tableros);
});

router.post('/', async (req, res) => {
  const { nombre } = req.body;
  const tablero = await prisma.tablero.create({
    data: {
      nombre,
      propietarioId: req.usuario.id,
      permisos: {
        create: { usuarioId: req.usuario.id, rol: 'owner' },
      },
    },
  });
  res.status(201).json(tablero);
});

export default router;