// Archivo principal de rutas
const express = require('express');
const router = express.Router();

// Ejemplo de ruta
router.get('/', (req, res) => {
  res.json({ mensaje: 'API funcionando correctamente' });
});

module.exports = router;
