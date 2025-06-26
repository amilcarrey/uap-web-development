import express from 'express';
import { requireAuth } from '../middleware/error.middleware';
import { 
  getConfiguraciones, 
  updateConfiguraciones, 
  resetConfiguraciones 
} from '../controllers/configuracionesController';

const router = express.Router();
router.use(requireAuth); 

router.get('/', getConfiguraciones);
router.put('/', updateConfiguraciones);
router.post('/reset', resetConfiguraciones);

export default router;