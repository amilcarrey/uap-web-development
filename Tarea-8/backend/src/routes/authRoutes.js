// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Ruta para registrar un nuevo usuario
router.post('/register', authController.register);

// Ruta para iniciar sesión
router.post('/login', authController.login);

// Ruta para cerrar sesión
router.post('/logout', authController.logout);

// NUEVA RUTA: Ruta para verificar el estado de la sesión y obtener el usuario actual
router.get('/me', authController.getMe); // Asegúrate de que tu authController tenga un método getMe

module.exports = router;