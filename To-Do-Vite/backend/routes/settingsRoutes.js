const express = require('express');
const settingsController = require('../controllers/settingsController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

// Obtener ajustes del usuario
router.get('/', settingsController.getUserSettings);

// Actualizar ajustes del usuario
router.put('/', settingsController.updateUserSettings);

module.exports = router; 