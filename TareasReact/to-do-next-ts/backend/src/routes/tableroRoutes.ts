import express from 'express';
import {
  obtenerTableros,
  crearTablero,
  eliminarTablero,
  obtenerTableroPorId,
  compartirTablero,
  modificarPermiso,
  obtenerUsuariosConPermisos
} from '../controllers/tableroController';
import { protegerRuta } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', protegerRuta, obtenerTableros);
router.post('/', protegerRuta, crearTablero);
router.delete('/:id', protegerRuta, eliminarTablero);
router.get('/:id', protegerRuta, obtenerTableroPorId);
router.post('/:id/compartir', protegerRuta, compartirTablero);
router.put('/:id/permiso', protegerRuta, modificarPermiso);
router.get('/:id/usuarios', protegerRuta, obtenerUsuariosConPermisos);

export default router;
