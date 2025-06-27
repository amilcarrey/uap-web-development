import { Router } from 'express';
import {
  crearTareaHandler,
  obtenerTareasHandler,
  obtenerTareaHandler,
  actualizarTareaHandler,
  eliminarTareaHandler,
  eliminarTareasCompletadasHandler,
  marcarVariasComoCompletadasHandler,
  obtenerEstadisticasHandler
} from '../controllers/tarea.controller';
import { verificarToken } from '../middlewares/verificarToken';
import { validate, validationRules } from '../middlewares/validation';
import { verificarEditorTableroId, verificarLectorTableroId } from '../middlewares/authMiddleware';

const router = Router();


router.use(verificarToken);


router.post('/tablero/:tableroId', validate(validationRules.tarea), crearTareaHandler);
router.get('/tablero/:tableroId', obtenerTareasHandler);
router.get('/tablero/:tableroId/estadisticas', obtenerEstadisticasHandler);
router.delete('/tablero/:tableroId/completadas', eliminarTareasCompletadasHandler);
router.patch('/tablero/:tableroId/completar-varias', marcarVariasComoCompletadasHandler);


router.get('/:id', obtenerTareaHandler);
router.put('/:id', actualizarTareaHandler);
router.delete('/:id', eliminarTareaHandler);

export default router;
