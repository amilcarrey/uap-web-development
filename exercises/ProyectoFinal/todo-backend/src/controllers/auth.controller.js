// src/controllers/auth.controller.js

const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const User   = require('../models/user.model');

/**
 * Registro de usuario
 */
const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1) Verificar que no exista ya ese email
    const existing = await User.findByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'Email ya registrado' });
    }

    // 2) Generar hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // 3) Crear usuario en BD
    const user = await User.create({ email, passwordHash: hash });

    // 4) Responder con id y email
    res.status(201).json({ id: user.id, email: user.email });
  } catch (err) {
    next(err);
  }
};

/**
 * Login de usuario
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1) Buscar usuario por email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // 2) Comparar password con el hash
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // 3) Generar JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    // 4) Enviar token en cookie HTTP-only
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 2 * 60 * 60 * 1000  // 2 horas
    });

    res.json({ message: 'Login exitoso' });
  } catch (err) {
    next(err);
  }
};

/**
 * Logout (limpia la cookie)
 */
const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logout exitoso' });
};

module.exports = { register, login, logout };
