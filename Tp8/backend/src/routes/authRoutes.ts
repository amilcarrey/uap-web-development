// src/routes/authRoutes.ts
import express from 'express';
import { login, register, logout } from '../controllers/authController';
import { getCurrentUser } from '../controllers/authController';
import { requireAuth } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', (req, res) => {
  register(req, res).catch((err) => res.status(500).json({ error: err.message }));
});
router.post('/login', (req, res) => {
  login(req, res).catch((err) => res.status(500).json({ error: err.message }));
});
router.post('/logout', logout);
router.get('/me', requireAuth, (req, res) => {
  getCurrentUser(req, res).catch((err) => res.status(500).json({ error: err.message }));
});


export default router;
