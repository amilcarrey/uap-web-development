import express from 'express';
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

// GET /tareas - Listar tareas con filtros y paginación
router.get('/', getTareas);

// POST /tareas - Agregar nueva tarea
router.post('/', createTarea);

// POST /tareas/filtro - Filtrar tareas
router.post('/filtro', filtrarTareas);

// DELETE /tareas/completadas - Eliminar todas las tareas completadas
router.delete('/completadas', deleteCompletadas);

// PUT /tareas/:id/toggle - Cambiar estado completada/pendiente
router.put('/:id/toggle', toggleTarea);

// PUT /tareas/:id - Actualizar descripción de tarea
router.put('/:id', updateDescripcionTarea);

// DELETE /tareas/:id - Eliminar tarea específica (DEBE IR DESPUÉS de /completadas)
router.delete('/:id', deleteTarea);

export default router;