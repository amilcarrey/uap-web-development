import express from 'express';
import { registrarUsuario, loginUsuario } from '../controllers/authController';
import { protegerRuta } from '../middlewares/authMiddleware';
import 'express';

const router = express.Router();

router.post('/registro', registrarUsuario);
router.post('/login', loginUsuario);

router.get('/test', protegerRuta, (req, res) => {
  const usuario = req.usuario; // <- Esto debe funcionar sin error
  res.json({ ok: true });
});

export default router;
