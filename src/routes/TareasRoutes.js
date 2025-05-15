const express = require('express');
const router = express.Router();
const tareasController = require('../Controllers/tareasController');

router.get('/', tareasController.mostrarTareas);
router.post('/crear', tareasController.crearTarea);
router.post('/completar', tareasController.completarTarea);
router.post('/eliminarCompletadas', tareasController.eliminarCompletadas);
router.post('/eliminar', tareasController.eliminarTarea);
router.get('/filtrar', tareasController.filtrarTareas);

module.exports = router;