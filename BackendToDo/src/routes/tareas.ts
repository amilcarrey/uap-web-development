import express from 'express';
import { requireAuth } from '../middleware/error.middleware';
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

// GET /tareas - Solo requiere lectura
router.get('/', requirePermission('leer'), getTareas); 

// POST /tareas - Requiere escritura
router.post('/', requirePermission('escribir'), createTarea); 

// POST /tareas/filtro - Solo lectura
router.post('/filtro', requirePermission('leer'), filtrarTareas);

// DELETE /tareas/completadas - Requiere escritura
router.delete('/completadas', requirePermission('escribir'), deleteCompletadas); 

// PUT /tareas/:id/toggle - Requiere escritura
router.put('/:id/toggle', requirePermission('escribir'), toggleTarea); 

// PUT /tareas/:id - Requiere escritura
router.put('/:id', requirePermission('escribir'), updateDescripcionTarea); 

// DELETE /tareas/:id - Requiere escritura
router.delete('/:id', requirePermission('escribir'), deleteTarea); 

export default router;