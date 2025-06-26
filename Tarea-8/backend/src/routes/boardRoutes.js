// backend/src/routes/boardRoutes.js
const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardController');
const { protect } = require('../middleware/authMiddleware'); // Importa el middleware de protección

// Todas estas rutas necesitan autenticación, por eso usamos 'protect'
router.route('/')
    .get(protect, boardController.getBoards)      // Obtener todos los tableros del usuario
    .post(protect, boardController.createBoard);  // Crear un nuevo tablero

router.route('/:id')
    .get(protect, boardController.getBoardById)   // Obtener un tablero por ID
    .put(protect, boardController.updateBoard)    // Actualizar un tablero
    .delete(protect, boardController.deleteBoard); // Eliminar un tablero

module.exports = router;