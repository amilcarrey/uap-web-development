// src/routes/authRoutes.ts
import express from 'express';
import { login, register, logout, getCurrentUser } from '../controllers/authController';
import { requireAuth } from '../middleware/authMiddleware';
import { prisma } from '../../prisma/client';

const router = express.Router();

// ---------- Rutas públicas ----------
router.post('/register', (req, res) => {
  register(req, res).catch((err) =>
    res.status(500).json({ error: err.message })
  );
});

router.post('/login', (req, res) => {
  login(req, res).catch((err) =>
    res.status(500).json({ error: err.message })
  );
});

router.post('/logout', logout);

// ---------- Rutas privadas ----------
router.get('/me', requireAuth, (req, res) => {
  getCurrentUser(req, res).catch((err) =>
    res.status(500).json({ error: err.message })
  );
});

// GET /api/auth/preferences
router.get('/preferences', requireAuth, async (req, res) => {
  const userId = req.user?.id;

  const prefs = await prisma.userPreferences.findUnique({
    where: { userId },
  });

  res.json(prefs || { capitalizeTasks: false, refreshInterval: 60000 });
});

// PUT /api/auth/preferences
router.put("/preferences", requireAuth, async (req, res) => {
  const userId = req.user?.id;
  const { capitalizeTasks, refreshInterval } = req.body;

  if (!userId) {
    return res.status(401).json({ error: "No autorizado: falta el ID de usuario" });
  }

  const updated = await prisma.userPreferences.upsert({
    where: { userId },
    update: { capitalizeTasks, refreshInterval },
    create: { userId, capitalizeTasks, refreshInterval },
  });

  res.json(updated);
});

export default router;
