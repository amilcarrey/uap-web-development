import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {
  crearUsuarioService,
  obtenerUsuarioPorEmailService
} from '../servieces/usuarioServieces.js';

// REGISTRARSE
export const registrarse = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    if (!nombre || !email || !password)
      return res.status(400).json({ message: 'Faltan datos requeridos' });

    // Revisar si el usuario ya existe
    const usuarioExistente = await obtenerUsuarioPorEmailService(email);
    if (usuarioExistente)
      return res.status(409).json({ message: 'El email ya está registrado' });

    // Crear usuario
    const nuevoUsuario = await crearUsuarioService({ nombre, email, password });

    // Generar token
    const JWT_SECRET = process.env.JWT_SECRET || "1234567890123456789012345678901234567890123456789012345678901234567890";
    const token = jwt.sign(
      { id: nuevoUsuario.id, email: nuevoUsuario.email },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(201).json({ usuario: nuevoUsuario, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en el registro' });
  }
};

// LOGEARSE
export const logearse = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Faltan datos requeridos' });

    const usuario = await obtenerUsuarioPorEmailService(email);
    if (!usuario)
      return res.status(404).json({ message: 'Usuario no encontrado' });

    const passwordValido = await bcrypt.compare(password, usuario.password_hash);
    if (!passwordValido)
      return res.status(401).json({ message: 'Contraseña incorrecta' });

    const JWT_SECRET = process.env.JWT_SECRET || "1234567890123456789012345678901234567890123456789012345678901234567890";
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(200).json({ usuario, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en el login' });
  }
};
