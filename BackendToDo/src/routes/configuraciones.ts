import express from 'express';
import { requireAuth } from '../middleware/error.middleware';
import { 
  getConfiguraciones, 
  updateConfiguraciones, 
  resetConfiguraciones 
} from '../controllers/configuracionesController';

const router = express.Router();

router.use(requireAuth); // Asegurar que todas las rutas necesiten autenticación
// GET /configuraciones - Obtener configuraciones actuales
router.get('/', getConfiguraciones);

// PUT /configuraciones - Actualizar configuraciones
router.put('/', updateConfiguraciones);

// POST /configuraciones/reset - Resetear configuraciones a valores por defecto
router.post('/reset', resetConfiguraciones);

export default router;