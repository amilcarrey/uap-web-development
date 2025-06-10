import express from 'express';
import { 
  getConfiguraciones, 
  updateConfiguraciones, 
  resetConfiguraciones 
} from '../controllers/configuracionesController';

const router = express.Router();

// GET /configuraciones - Obtener configuraciones actuales
router.get('/', getConfiguraciones);

// PUT /configuraciones - Actualizar configuraciones
router.put('/', updateConfiguraciones);

// POST /configuraciones/reset - Resetear configuraciones a valores por defecto
router.post('/reset', resetConfiguraciones);

export default router;