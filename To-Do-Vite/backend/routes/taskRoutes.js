const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/auth');

// Todas las rutas aquí están prefijadas con /boards/:boardName/tasks (en server.js) y protegidas
router.use(authMiddleware);

// Rutas para tareas
router.get('/', taskController.getTasks);
router.post('/', taskController.createTask);
router.patch('/:taskId', taskController.updateTask);
router.delete('/completed', taskController.deleteCompletedTasks);
router.delete('/:taskId', taskController.deleteTask);

module.exports = router; 