// 📁 src/routes/configuracion.js
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middlewares/auth.js';

const prisma = new PrismaClient();
const router = express.Router();

router.use(requireAuth);

router.get('/', async (req, res) => {
  const config = await prisma.configuracion.findUnique({
    where: { usuarioId: req.usuario.id },
  });
  res.json(config);
});

router.patch('/', async (req, res) => {
  const config = await prisma.configuracion.upsert({
    where: { usuarioId: req.usuario.id },
    update: req.body,
    create: {
      usuarioId: req.usuario.id,
      ...req.body,
    },
  });
  res.json(config);
});

export default router;