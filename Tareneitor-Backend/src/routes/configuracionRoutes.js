const express = require('express');
const router = express.Router();

// Importa el controlador de configuración
const configuracionController = require('../controllers/configuracionController');
// Importa el middleware de autenticación
const { autenticar } = require('../middleware/autenticacion');

// Ruta para crear una configuración (requiere autenticación)
router.post('/config', autenticar, configuracionController.crearConfiguracion);

// Ruta para obtener la configuración (requiere autenticación)
router.get('/config', autenticar, configuracionController.obtenerConfiguracion);

// Ruta para actualizar la configuración (requiere autenticación)
router.put('/config', autenticar, configuracionController.actualizarConfiguracion);

// Ruta para restablecer la configuración (requiere autenticación) - NUEVA RUTA
router.put('/restablecer', autenticar, configuracionController.restablecerConfiguracion);

module.exports = router;
