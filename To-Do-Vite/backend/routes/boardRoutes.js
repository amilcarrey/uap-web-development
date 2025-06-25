const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', boardController.getBoards);
router.post('/', boardController.createBoard);
router.delete('/:name', boardController.deleteBoard);

router.post('/:name/share', boardController.shareBoard);
router.get('/:name/users', boardController.getBoardUsers);
router.delete('/:name/users/:username', boardController.removeUserFromBoard);

module.exports = router; 