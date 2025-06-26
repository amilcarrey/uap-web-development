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
  filtrarTareas,
  buscarTareas
} from '../controllers/tareasController';

const router = express.Router();
router.use(requireAuth);

// Rutas protegidas por permisos
router.get('/', getTareas); 
router.get('/buscar', buscarTareas);
router.delete('/completadas', requirePermission('escribir'), deleteCompletadas);
router.post('/', requirePermission('escribir'), createTarea);
router.put('/:id', requirePermission('escribir'), updateDescripcionTarea);
router.delete('/:id', requirePermission('escribir'), deleteTarea);
router.put('/:id/toggle', requirePermission('escribir'), toggleTarea);
router.post('/filtro', filtrarTareas);

export default router;

// // Rutas específicas (primero) ESTO LO COMENTE PARA DEJARLO PARA MI Y SABER COMO UBICARLAS PORQUE 
// POR NO DECLARARLOS ASI TUVE UN ERROR DE QUE NO ENCONTRABA LAS RUTAS
// router.get('/', getTareas); 
// router.get('/buscar', buscarTareas);
// router.delete('/completadas', deleteCompletadas);  
// router.post('/', createTarea);

// // Rutas dinámicas (después)
// router.put('/:id', updateDescripcionTarea);         
// router.delete('/:id', deleteTarea);                 
// router.put('/:id/toggle', toggleTarea);             

// // Rutas específicas que no interfieren
// router.post('/filtro', filtrarTareas);