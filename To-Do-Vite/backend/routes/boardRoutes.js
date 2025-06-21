const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardController');
const authMiddleware = require('../middleware/auth');

// Todas las rutas aquí están prefijadas con /boards (en server.js) y protegidas
router.use(authMiddleware);

// Rutas para tableros
router.get('/', boardController.getBoards);
router.post('/', boardController.createBoard);
router.delete('/:name', boardController.deleteBoard);

// Rutas para compartir y gestionar usuarios de un tablero
router.post('/:name/share', boardController.shareBoard);
router.get('/:name/users', boardController.getBoardUsers);
router.delete('/:name/users/:username', boardController.removeUserFromBoard);

module.exports = router; 