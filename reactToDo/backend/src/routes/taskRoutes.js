const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middlewares/authMiddleware');

// Todas las rutas requieren autenticación
router.get('/', auth, taskController.getAll);
router.post('/', auth, taskController.createTask);
router.patch('/:id', auth, taskController.updateTask);
router.delete('/:id', auth, taskController.deleteTask);
router.delete('/clear-completed/:boardId', auth, taskController.clearCompleted);

module.exports = router;
