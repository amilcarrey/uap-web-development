// backend/src/routes/taskRoutes.js
const express = require('express');
const { protect } = require('../middleware/authMiddleware'); // Importa tu middleware de protección
const taskController = require('../controllers/taskController'); // Importa el controlador de tareas

const router = express.Router();

// Rutas para tareas asociadas a un tablero
router.route('/boards/:boardId/tasks')
    .get(protect, taskController.getAllTasks) // Obtener todas las tareas de un tablero
    .post(protect, taskController.createTask); // Crear una nueva tarea en un tablero

// Rutas para tareas individuales (por ID de tarea)
router.route('/tasks/:id')
    .get(protect, taskController.getTaskById) // Obtener una tarea por su ID
    .put(protect, taskController.updateTask) // Actualizar una tarea por su ID
    .delete(protect, taskController.deleteTask); // Eliminar una tarea por su ID

module.exports = router;