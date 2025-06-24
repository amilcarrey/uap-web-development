import express from 'express';
import { requireAuth } from '../middleware/error.middleware';
// COMENTAR TEMPORALMENTE:
// import { verificarAccesoTableroByAlias, soloPropietario } from '../middleware/authorization.middleware';
import { 
  getTableroPorAlias, 
  createTablero, 
  getTableros, 
  deleteTablero,
  compartirTablero, 
  obtenerUsuariosTablero, 
  revocarAccesoTablero
} from '../controllers/tablerosController';
import { soloPropietario } from '../middleware/authorization.middleware';

const router = express.Router();
router.use(requireAuth); // Solo autenticación básica

// Rutas simplificadas
router.get('/', getTableros);
router.post('/', createTablero);
router.get('/:alias', getTableroPorAlias); 
router.post('/:id/compartir', compartirTablero); 
router.get('/:id/usuarios', obtenerUsuariosTablero); 
router.delete('/:id/acceso/:usuarioId', revocarAccesoTablero); 
router.delete('/:alias', soloPropietario, deleteTablero);

export default router;