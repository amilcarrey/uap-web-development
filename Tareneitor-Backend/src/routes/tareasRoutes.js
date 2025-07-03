const express = require('express');
const router = express.Router();
const tareasController = require('../controllers/tareasController');
const authMiddleware = require('../middleware/authMiddleware');
const verificarPermisoTarea = require('../middleware/verificarPermisoTarea');
const { autorizarPermisoTablero } = require('../middleware/autorizar');
// Crear una nueva tarea en un tablero
router.post('/tableros/:id/tareas', authMiddleware, tareasController.crearTarea);

// Obtener todas las tareas de un tablero
router.get('/tableros/:id/tareas', authMiddleware, tareasController.obtenerTareas);

// Actualizar una tarea específica
router.put('/tareas/:id', authMiddleware, verificarPermisoTarea, tareasController.actualizarTarea);

// Eliminar una tarea específica
router.delete('/tareas/:id', authMiddleware, verificarPermisoTarea, tareasController.eliminarTarea);

// Eliminar todas las tareas completadas de un tablero (requiere permiso de editor)
router.delete('/tableros/:id/tareas', authMiddleware, autorizarPermisoTablero(['editor']), tareasController.eliminarTareasCompletadas);

module.exports = router;
