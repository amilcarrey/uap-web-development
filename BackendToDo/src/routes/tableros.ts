import express from 'express';
import { requireAuth } from '../middleware/error.middleware';
import { verificarAccesoTableroByAlias, soloPropietario } from '../middleware/authorization.middleware'; 
import { 
  getTableroPorAlias, 
  createTablero, 
  getTableros, 
  deleteTablero,
  compartirTablero, 
  obtenerUsuariosTablero, 
  revocarAccesoTablero
} from '../controllers/tablerosController';

const router = express.Router();

// Aplicar autenticación a todas las rutas
router.use(requireAuth);

// GET /tableros - Listar tableros donde el usuario tiene acceso
router.get('/', getTableros); // Este controller ya filtrará por usuario

// POST /tableros - Crear nuevo tablero (cualquier usuario autenticado)
router.post('/', createTablero);

// GET /tableros/:alias - Solo lectura
router.get('/:alias', verificarAccesoTableroByAlias, getTableroPorAlias); 

// POST /tableros/:id/compartir - Solo gestión (propietarios)
router.post('/:id/compartir', compartirTablero); 

// GET /tableros/:id/usuarios - Solo gestión
router.get('/:id/usuarios', obtenerUsuariosTablero); 

// DELETE /tableros/:id/acceso/:usuarioId - Solo gestión
router.delete('/:id/acceso/:usuarioId', soloPropietario, revocarAccesoTablero); 

// DELETE /tableros/:alias - Solo gestión
router.delete('/:alias', verificarAccesoTableroByAlias, soloPropietario, deleteTablero);

export default router;