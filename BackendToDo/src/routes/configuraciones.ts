import express from 'express';
import { requireAuth } from '../middleware/error.middleware';
// import { requirePermission } from '../middleware/authorization.middleware'; // COMENTAR
import { 
  getConfiguraciones, 
  updateConfiguraciones, 
  resetConfiguraciones 
} from '../controllers/configuracionesController';

const router = express.Router();
router.use(requireAuth); // Solo autenticación básica

router.get('/', getConfiguraciones);
router.put('/', updateConfiguraciones);
router.post('/reset', resetConfiguraciones);

export default router;