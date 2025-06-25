const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', taskController.getTasks);
router.post('/', taskController.createTask);
router.patch('/:taskId', taskController.updateTask);
router.delete('/completed', taskController.deleteCompletedTasks);
router.delete('/:taskId', taskController.deleteTask);

module.exports = router; 