import express from 'express';
import { getTableroPorAlias, createTablero, getTableros, deleteTablero } from '../controllers/tablerosController';

const router = express.Router();

// GET /tableros - Listar todos los tableros
router.get('/', getTableros);

// POST /tableros - Crear nuevo tablero
router.post('/', createTablero);

// GET /tableros/:alias - Obtener tablero por alias
router.get('/:alias', getTableroPorAlias);

// DELETE /tableros/:alias - Eliminar tablero por alias
router.delete('/:alias', deleteTablero);

export default router;