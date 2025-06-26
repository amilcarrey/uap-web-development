// src/index.js
require('dotenv').config();

const cors = require('cors');

const express      = require('express');
const cookieParser = require('cookie-parser');
const db           = require('./config/db');


const authRoutes   = require('./routes/auth.routes');
const boardRoutes  = require('./routes/board.routes');

const taskRoutes = require('./routes/task.routes');
const app = express();

app.use(cors({
   origin: 'http://localhost:3000',
   credentials: true
 }));

const settingsRoutes = require('./routes/settings.routes');
const authenticate   = require('./middlewares/authenticate');

// Middlewares globales
app.use(express.json());
app.use(cookieParser());

// Rutas
app.use('/auth', authRoutes);
app.use('/boards', boardRoutes);
app.use('/boards/:id/tasks', taskRoutes);
app.use(
  '/users/me/settings',
  authenticate,
  settingsRoutes
);
// Health check de la BD al iniciar
db.query('SELECT NOW()')
  .then(r => console.log('✅ PostgreSQL OK:', r.rows[0].now))
  .catch(err => {
    console.error('❌ Error al conectar a PostgreSQL:', err.message);
    process.exit(1);
  });

// Ejemplo de ruta protegida
app.get('/protected', require('./middlewares/authenticate'), (req, res) => {
  res.json({ message: `Hola usuario ${req.user.id}` });
});

// Ruta raíz
app.get('/', (req, res) => {
  res.send('✅ Backend Express OK');
});

// 404 para endpoints no definidos
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado' });
});

// Middleware global de errores
app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ error: err.message || 'Error interno del servidor' });
});

// Arranque del servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
