import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'; 
import dotenv from 'dotenv';
import tareasRoutes from './routes/tareas';
import tablerosRoutes from './routes/tableros';
import configuracionesRoutes from './routes/configuraciones';
import usuariosRoutes from './routes/usuarios';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

// Cargar variables de entorno
dotenv.config();

// Crear aplicación Express
const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares globales
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging mejorado
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`📡 ${req.method} ${req.path} - ${new Date().toLocaleTimeString()}`);
    next();
  });
}

// Rutas de la API
app.use('/api/tareas', tareasRoutes);
app.use('/api/tableros', tablerosRoutes);
app.use('/api/configuraciones', configuracionesRoutes);
app.use('/api/usuarios', usuariosRoutes);

// Middleware para rutas no encontradas 
app.use('/api/*', notFoundHandler);

// Middleware de manejo de errores
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Backend iniciado en puerto ${PORT}`);
});

export default app;