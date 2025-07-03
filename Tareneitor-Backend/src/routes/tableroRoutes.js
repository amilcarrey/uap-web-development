const express = require('express');
const router = express.Router();
const tableroController = require('../controllers/tableroController');
const { autenticar } = require('../middleware/autenticacion');
const { autorizarPermisoTablero } = require('../middleware/autorizar');

// Ruta para crear un nuevo tablero (requiere autenticación)
router.post('/', autenticar, tableroController.crearTablero);

// Ruta para obtener los tableros propios del usuario autenticado
router.get('/propios', autenticar, tableroController.obtenerTablerosPropios);

// Ruta para obtener los tableros compartidos con el usuario autenticado
router.get('/compartidos', autenticar, tableroController.obtenerTablerosCompartidos);

// Ruta para obtener un tablero por ID (requiere permisos: propietario, editor o lector)
router.get('/:id', autenticar, autorizarPermisoTablero(['propietario','editor','lector']), tableroController.obtenerTableroPorId);

// Ruta para editar un tablero por ID (requiere permisos: propietario o editor)
router.put('/:id', autenticar, autorizarPermisoTablero(['propietario','editor']), tableroController.editarTablero);

// Ruta para eliminar un tablero por ID (requiere permiso: propietario)
router.delete('/:id', autenticar, autorizarPermisoTablero(['propietario']), tableroController.eliminarTablero);

module.exports = router;
