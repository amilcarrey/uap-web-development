const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authenticateToken = require('../middlewares/authMiddleware');

router.get('/', authenticateToken, taskController.getAll);
router.post('/', authenticateToken, taskController.create);
router.patch('/:id', authenticateToken, taskController.update);
router.delete('/:id', authenticateToken, taskController.remove);
router.post('/clear-completed', authenticateToken, taskController.clearCompleted);

module.exports = router;
