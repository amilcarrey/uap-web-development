import express from 'express';
import {
  crearTablero,
  borrarTablero,
  obtenerTodosLosTableros,
  obtenerTableroPorId
} from '../controllers/tableros.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { checkBoardPermission } from '../middlewares/checkpermissions.middleware';

const router = express.Router();

/**
 * Crear un nuevo tablero.
 * Método: POST /add
 * Requiere autenticación.
 */
router.post('/add', authenticateToken, crearTablero);

/**
 * Eliminar un tablero.
 * Método: DELETE /delete/:boardId
 * Solo puede hacerlo el propietario.
 */
router.delete('/delete/:boardId', authenticateToken, checkBoardPermission('propietario'), borrarTablero);

/**
 * Obtener todos los tableros donde el usuario tenga algún permiso.
 * Método: GET /get
 * Requiere autenticación.
 */
router.get('/get', authenticateToken, obtenerTodosLosTableros);

/**
 * Obtener un tablero por ID.
 * Método: GET /getbyId/:boardId
 * Requiere al menos permiso de lectura.
 */
router.get('/getbyId/:boardId', authenticateToken, checkBoardPermission('lectura'), obtenerTableroPorId);

export default router;
