// src/routes/auth.routes.js
const { Router }      = require('express');
const { check }       = require('express-validator');
const { register, login, logout } = require('../controllers/auth.controller');
const { validateFields }          = require('../middlewares/validateFields');
const authenticate                 = require('../middlewares/authenticate');

const router = Router();

// Registro
router.post(
  '/register',
  [
    check('email','Email inválido').isEmail(),
    check('password','Mínimo 6 caracteres').isLength({ min: 6 }),
    validateFields
  ],
  register
);

// Login
router.post(
  '/login',
  [
    check('email','Email inválido').isEmail(),
    check('password','La password es obligatoria').notEmpty(),
    validateFields
  ],
  login
);

// Logout
router.post('/logout', logout);

// Me: devuelve id del usuario autenticado
router.get('/me', authenticate, (req, res) => {
  res.json({ id: req.user.id });
});

module.exports = router;
