import { Router } from 'express';
import {
  creartarea,
  borrartarea,
  editartarea,
  togle,
  togleconsult,
  clearcompleted,
  getfiltered,
  busquedaTareas
} from '../controllers/task.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { checkBoardPermission } from '../middlewares/checkpermissions.middleware';

const router = Router();

/**
 * Crear tarea en un tablero.
 * Requiere permiso de editor.
 */
router.post('/add/:boardId', authenticateToken, checkBoardPermission('editor'), creartarea);

/**
 * Eliminar tarea de un tablero.
 * Requiere permiso de editor.
 */
router.delete('/delete/:boardId', authenticateToken, checkBoardPermission('editor'), borrartarea);

/**
 * Editar tarea en un tablero.
 * Requiere permiso de editor.
 */
router.patch('/edit/:boardId', authenticateToken, checkBoardPermission('editor'), editartarea);

/**
 * Alternar estado completado de tarea.
 * Requiere permiso de editor.
 */
router.post('/toggle/:boardId', authenticateToken, checkBoardPermission('editor'), togle);

/**
 * Consultar estado completado de tarea.
 * Requiere permiso de lectura.
 */
router.post('/consultarEstado/:boardId', authenticateToken, checkBoardPermission('lectura'), togleconsult);

/**
 * Limpiar todas las tareas completadas de un tablero.
 * Requiere permiso de editor.
 */
router.post('/clearCompleted/:boardId', authenticateToken, checkBoardPermission('editor'), clearcompleted);

/**
 * Obtener tareas filtradas con paginación.
 */
router.get('/getFiltered/:boardId', authenticateToken, checkBoardPermission('lectura'), getfiltered);

/**
 * Buscar tareas en un tablero.
 * Requiere permiso de lectura.
 */
router.get('/search/:boardId', authenticateToken, checkBoardPermission('lectura'), busquedaTareas);

export default router;


