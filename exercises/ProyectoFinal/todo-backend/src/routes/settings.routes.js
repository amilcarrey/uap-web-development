// src/routes/settings.routes.js
const { Router }        = require('express');
const { check }         = require('express-validator');
const { validateFields } = require('../middlewares/validateFields');
const {
  getSettings,
  updateSettings
} = require('../controllers/settings.controller');

const router = Router();

// Obtener preferencias
router.get('/', getSettings);

// Actualizar preferencias
router.put(
  '/',
  [
    check('preferences', 'Preferences debe ser un objeto')
      .custom(val => typeof val === 'object' && val !== null),
    validateFields
  ],
  updateSettings
);

module.exports = router;
