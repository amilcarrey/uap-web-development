const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardController');
const authenticateToken = require('../middlewares/authMiddleware');

router.get('/', authenticateToken, boardController.getAll);
router.post('/', authenticateToken, boardController.create);
router.delete('/:id', authenticateToken, boardController.remove);

module.exports = router