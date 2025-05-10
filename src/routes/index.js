const express = require('express');
const router = express.Router();
const tareasRoutes = require('./TareasRoutes');

router.use('/', tareasRoutes);

module.exports = router;
