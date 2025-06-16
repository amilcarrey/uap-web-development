import express from 'express';
import { requireAuth } from '../middleware/error.middleware';
import { getTableroPorAlias, createTablero, getTableros, deleteTablero } from '../controllers/tablerosController';

const router = express.Router();

router.use(requireAuth); // Asegurar que todas las rutas necesiten autenticación
// GET /tableros - Listar todos los tableros
router.get('/', getTableros);

// POST /tableros - Crear nuevo tablero
router.post('/', createTablero);

// GET /tableros/:alias - Obtener tablero por alias
router.get('/:alias', getTableroPorAlias);

// DELETE /tableros/:alias - Eliminar tablero por alias
router.delete('/:alias', deleteTablero);

export default router;