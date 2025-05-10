const express = require('express');
const router = express.Router();
const tareasRoutes = require('./TareasRoutes');

// Usa las rutas de tareas
router.use('/', tareasRoutes);

module.exports = router;