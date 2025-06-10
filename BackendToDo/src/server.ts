import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import tareasRoutes from './routes/tareas';
import tablerosRoutes from './routes/tableros';
import configuracionesRoutes from './routes/configuraciones';
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging para desarrollo
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

// Middleware para rutas no encontradas 
app.use('/api/*', notFoundHandler);

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Backend iniciado en puerto ${PORT}`);
});

export default app;