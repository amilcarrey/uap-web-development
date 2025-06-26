import express from 'express';
import { requireAuth } from '../middleware/error.middleware';
import { 
  getTableroPorAlias, 
  createTablero, 
  getTableros, 
  deleteTablero,
  compartirTablero,  
  getMisTableros
} from '../controllers/tablerosController';
import { soloPropietario } from '../middleware/authorization.middleware';

const router = express.Router();
router.use(requireAuth);


router.get('/mios', getMisTableros);
router.get('/', getTableros);
router.post('/', createTablero);
router.get('/:alias', getTableroPorAlias); 
router.post('/:alias/compartir', soloPropietario, compartirTablero);  
router.delete('/:alias', soloPropietario, deleteTablero);

export default router;