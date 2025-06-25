import express from 'express';
import {
  obtenerTareas,
  agregarTarea,
  toggleTarea,
  editarTarea,
  borrarTarea,
  limpiarTareasCompletadas,
} from '../controllers/tareasController';
import { protegerRuta } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', obtenerTareas);
router.post('/', agregarTarea);
router.put('/:id/toggle', toggleTarea); 
router.put('/:id', editarTarea);
router.delete('/:id', borrarTarea);
router.delete('/limpiar/:tableroId', protegerRuta, limpiarTareasCompletadas);

export default router;
