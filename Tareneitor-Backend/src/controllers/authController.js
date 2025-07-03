const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const Usuario = require('../models/Usuario');

const JWT_SECRET = process.env.JWT_SECRET || 'secreto_super_seguro';
const JWT_EXPIRACION = '1h';

const register = async (req, res) => {
  const { nombre_usuario, correo, contraseña } = req.body;

  if (!nombre_usuario || !correo || !contraseña) {
    return res.status(400).json({ mensaje: 'Faltan campos obligatorios.' });
  }

  try {
    const existente = await Usuario.findOne({ where: { correo } });
    if (existente) {
      return res.status(409).json({ mensaje: 'Ya existe un usuario con ese correo.' });
    }

    const hash = await bcrypt.hash(contraseña, 10);
    const nuevoUsuario = await Usuario.create({ nombre_usuario, correo, contraseña: hash });

    res.status(201).json({
      mensaje: 'Usuario registrado con éxito',
      usuario: {
        id_usuario: nuevoUsuario.id_usuario,
        nombre_usuario: nuevoUsuario.nombre_usuario,
        correo: nuevoUsuario.correo
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

/**
 * Handles user login by validating credentials, generating a JWT token, and setting it as an HTTP-only cookie.
 *
 * @async
 * @function
 * @param {import('express').Request} req - Express request object containing 'correo' and 'contraseña' in the body.
 * @param {import('express').Response} res - Express response object used to send responses and set cookies.
 * @returns {Promise<void>} Sends a JSON response with login status and user info, or an error message.
 */
const login = async (req, res) => { 
  const { correo, contraseña } = req.body;

  if (!correo || !contraseña) {
    return res.status(400).json({ mensaje: 'Faltan campos obligatorios.' });
  }

  try {
    const usuario = await Usuario.findOne({ where: { correo } });
    if (!usuario) {
      return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos.' });
    }

    const isMatch = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!isMatch) {
      return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos.' });
    }

    // Generar JWT
    const token = jwt.sign(
      { id_usuario: usuario.id_usuario, correo: usuario.correo },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRACION }
    );

    // Enviar token en cookie HTTP-only
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'Strict',
      maxAge: 24 * 60 * 60 * 1000 // 1 día en ms
    });

    res.json({
      mensaje: 'Login exitoso',
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre_usuario: usuario.nombre_usuario,
        correo: usuario.correo
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict'
  });

  res.json({ mensaje: 'Logout exitoso' });
};

const obtenerUsuarioAutenticado = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id_usuario, {
      attributes: { exclude: ['contraseña'] }
    });

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.status(200).json(usuario);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

const obtenerUsuarioPorCorreo = async (req, res) => {
  const { correo } = req.params;

  try {
    const usuario = await Usuario.findOne({
      where: { correo },
      attributes: { exclude: ['contraseña'] }
    });

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.status(200).json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

module.exports = { register, login, logout, obtenerUsuarioAutenticado, obtenerUsuarioPorCorreo };