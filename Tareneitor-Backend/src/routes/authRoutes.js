const express = require('express');
const router = express.Router();

// Importa las funciones register y login del controlador de autenticación
const { register, login } = require('../controllers/authController');

// Importa todo el controlador de autenticación
const authController = require('../controllers/authController');

// Middleware para verificar el token de autenticación
const verificarToken = require('../middleware/authMiddleware');

// Importa el controlador de autenticación (parece redundante, pero se usa para obtener usuario por correo)
const usuariosController = require('../controllers/authController');

// Ruta para registrar un nuevo usuario
router.post('/register', register);

// Ruta para iniciar sesión
router.post('/login', login);

// Ruta para cerrar sesión
router.post('/logout', authController.logout);

// Ruta para obtener el usuario autenticado (requiere token)
router.get('/me', verificarToken, authController.obtenerUsuarioAutenticado);

// Ruta para obtener un usuario por correo
router.get('/:correo', usuariosController.obtenerUsuarioPorCorreo);

module.exports = router;