// src/routes/board.routes.js
const { Router }        = require('express');
const authenticate      = require('../middlewares/authenticate');
const authorize         = require('../middlewares/authorize');
const {
  create,
  list,
  getById,
  update,
  remove,
  share
} = require('../controllers/board.controller');

const router = Router();

// Ping de prueba
router.get('/ping', (req, res) => {
  return res.json({ pong: true });
});

// Crear tablero
router.post(
  '/',
  authenticate,
  create
);

// Listar tableros
router.get(
  '/',
  authenticate,
  list
);

// Detalle de tablero
router.get(
  '/:id',
  authenticate,
  authorize(['owner','editor','reader']),
  getById
);

// Actualizar tablero
router.put(
  '/:id',
  authenticate,
  authorize(['owner','editor']),
  update
);

// Eliminar tablero
router.delete(
  '/:id',
  authenticate,
  authorize(['owner']),
  remove
);

// Compartir tablero
router.post(
  '/:id/share',
  authenticate,
  authorize(['owner']),
  share
);

module.exports = router;
