// src/routes/task.routes.js
const { Router }        = require('express');
const authenticate      = require('../middlewares/authenticate');
const authorize         = require('../middlewares/authorize');
const {
  createTask,
  listTasks,
  updateTask,
  deleteTask,
  deleteCompleted,
  searchTasks
} = require('../controllers/task.controller');

const router = Router({ mergeParams: true });

// Crear tarea en un tablero (owner/editor)
router.post(
  '/',
  authenticate,
  authorize(['owner','editor']),
  createTask
);

// Listar tareas con paginación, filtros y búsqueda (owner/editor/reader)
router.get(
  '/',
  authenticate,
  authorize(['owner','editor','reader']),
  listTasks
);

router.delete(
  '/completed',
  authenticate,
  authorize(['owner','editor']),
  deleteCompleted
);

// Actualizar tarea (owner/editor)
router.put(
  '/:taskId',
  authenticate,
  authorize(['owner','editor']),
  updateTask
);

// Eliminar tarea individual (owner/editor)
router.delete(
  '/:taskId',
  authenticate,
  authorize(['owner','editor']),
  deleteTask
);

// Eliminar todas las tareas completadas en lote
router.delete(
  '/completed',
  authenticate,
  authorize(['owner','editor']),
  deleteCompleted
);

// Búsqueda de tareas por contenido
router.get(
  '/search',
  authenticate,
  authorize(['owner','editor','reader']),
  searchTasks
);

module.exports = router;
