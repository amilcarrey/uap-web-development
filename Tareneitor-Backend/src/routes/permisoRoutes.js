const express = require('express');
const router = express.Router({ mergeParams: true }); // Permite acceder a los parámetros de rutas padres, como :id del tablero

const permisoController = require('../controllers/permisoController');
const { autenticar } = require('../middleware/autenticacion');
const { autorizarPermisoTablero } = require('../middleware/autorizar');

// Ruta para agregar un permiso a un tablero, solo accesible por el propietario
router.post('/:id/permisos', autenticar, autorizarPermisoTablero(['propietario']), permisoController.agregarPermiso);

// Ruta para obtener los permisos de un tablero, solo accesible por el propietario
router.get('/:id/permisos', autenticar, autorizarPermisoTablero(['propietario']), permisoController.obtenerPermisos);

// Ruta para quitar un permiso a un usuario en un tablero, solo accesible por el propietario
router.delete('/:id/permisos/:usuarioId', autenticar, autorizarPermisoTablero(['propietario']), permisoController.quitarPermiso);

module.exports = router;
