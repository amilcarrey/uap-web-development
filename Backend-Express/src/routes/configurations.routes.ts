import express from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import { SearchConfig, UpdateConfig } from '../controllers/configurations.controller';

const router = express.Router();

/**
 * Ruta para obtener la configuración del usuario autenticado.
 * Método: GET /configuracion
 */
router.get('/', authenticateToken, SearchConfig);

/**
 * Ruta para actualizar la configuración del usuario autenticado.
 * Método: PUT /configuracion
 */
router.put('/', authenticateToken, UpdateConfig);

export default router;
