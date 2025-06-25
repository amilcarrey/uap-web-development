import express from 'express';
import { registrarUsuario, loginUsuario, logoutUsuario } from '../controllers/authController';
import { protegerRuta } from '../middlewares/authMiddleware';
import 'express';

const router = express.Router();

router.post('/registro', registrarUsuario);
router.post('/login', loginUsuario);
router.post('/logout', logoutUsuario);

router.get('/test', protegerRuta, (req, res) => {
  const { id, nombre, email } = req.usuario!;
  res.json({ id, nombre, email });
});


export default router;
