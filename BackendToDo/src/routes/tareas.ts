import express from 'express';
import { requireAuth, AuthRequest } from '../middleware/error.middleware';
import { requirePermission } from '../middleware/authorization.middleware'; 
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
router.put('/:id', requirePermission('escribir'), updateDescripcionTarea);
router.delete('/:id', requirePermission('escribir'), deleteTarea);
router.put('/:id/toggle', requirePermission('escribir'), toggleTarea);
router.delete('/completadas', requirePermission('escribir'), deleteCompletadas);
router.post('/filtro', filtrarTareas);

export default router;