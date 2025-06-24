import express from 'express';
import { requireAuth, AuthRequest } from '../middleware/error.middleware';
import { requirePermission } from '../middleware/authorization.middleware'; // DESCOMENTAR ESTA LÍNEA
import { 
  getTareas, 
  createTarea, 
  toggleTarea, 
  deleteTarea, 
  deleteCompletadas,
  updateDescripcionTarea,
  filtrarTareas 
} from '../controllers/tareasController';

const router = express.Router();
router.use(requireAuth);

// Rutas protegidas por permisos
router.get('/', getTareas); // Leer tareas: todos los que tengan acceso pueden ver

// Solo propietario/editor pueden crear, editar, eliminar, marcar tareas
router.post('/', requirePermission('escribir'), createTarea);
router.post('/filtro', filtrarTareas);
router.delete('/completadas', requirePermission('escribir'), deleteCompletadas);
router.put('/:id/toggle', requirePermission('escribir'), toggleTarea);
router.delete('/:id', requirePermission('escribir'), deleteTarea);
router.put('/:id', requirePermission('escribir'), updateDescripcionTarea);

export default router;