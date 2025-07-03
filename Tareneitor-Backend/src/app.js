const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const tableroRoutes = require('./routes/tableroRoutes');
const permisoRoutes = require('./routes/PermisoRoutes');
const tareasRoutes = require('./routes/tareasRoutes');
const configuracionRoutes = require('./routes/configuracionRoutes');

require('dotenv').config();

const app = express();

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173', // Permite solicitudes solo desde el frontend especificado
  credentials: true // Permite el envío de cookies y credenciales
}));
app.use(cookieParser()); // Analiza las cookies de las solicitudes entrantes
app.use(express.json()); // Analiza los cuerpos JSON de las solicitudes

// Rutas
app.use('/api/auth', authRoutes); // Rutas de autenticación
app.use('/api/usuarios', usuarioRoutes); // Rutas de usuarios
app.use('/api/tableros', tableroRoutes); // Rutas de tableros
app.use('/api/tableros', permisoRoutes); // Rutas de permisos sobre tableros
app.use('/api', tareasRoutes); // Rutas de tareas
app.use('/api', configuracionRoutes); // Rutas de configuración

module.exports = app;
