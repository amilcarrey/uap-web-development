const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authenticateToken = require('../middlewares/authMiddleware');

router.get('/', authenticateToken, taskController.getAll);
router.post('/', authenticateToken, taskController.create);
router.put('/:id', authenticateToken, taskController.update);
router.delete('/:id', authenticateToken, taskController.remove);

module.exports = router;
