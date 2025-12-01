// backend/index.js
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import tablerosRoutes from './routes/tableros.js';
import tareasRoutes from './routes/tareas.js';
import permisosRoutes from './routes/permisos.js';
import configuracionRoutes from './routes/configuracion.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173', // tu frontend
  credentials: true, // permite cookies
}));
app.use(express.json());
app.use(cookieParser());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/tableros', tablerosRoutes);
app.use('/api/tareas', tareasRoutes);
app.use('/api/permisos', permisosRoutes);
app.use('/api/configuracion', configuracionRoutes);

// Default
app.get('/', (req, res) => {
  res.send('Servidor corriendo');
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Start
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
});
