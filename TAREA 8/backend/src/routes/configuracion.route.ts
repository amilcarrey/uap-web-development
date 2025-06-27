import { Router } from 'express';
import {
  obtenerConfiguracionHandler,
  actualizarConfiguracionHandler,
  resetearConfiguracionHandler
} from '../controllers/configuracion.controller';
import { verificarToken } from '../middlewares/verificarToken';

const router = Router();

router.use(verificarToken);

router.get('/', obtenerConfiguracionHandler);
router.put('/', actualizarConfiguracionHandler); 
router.post('/reset', resetearConfiguracionHandler);

export default router;
