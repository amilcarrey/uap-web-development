const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { autenticar } = require('../middleware/autenticacion');

// Obtener todos los usuarios
router.get('/', autenticar, usuarioController.obtenerUsuarios);

// Obtener un usuario por ID
router.get('/:id', autenticar, usuarioController.obtenerUsuarioPorId);

// Actualizar un usuario por ID
router.put('/:id', autenticar, usuarioController.actualizarUsuario);

// Eliminar un usuario por ID
router.delete('/:id', autenticar, usuarioController.eliminarUsuario);

module.exports = router;
