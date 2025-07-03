import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes';
import boardRoutes from './routes/board.routes';
import { errorHandler } from './utils/errorHandler';

// Cargar variables de entorno desde .env
dotenv.config();

// Crear la aplicación Express
const app: Express = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/boards', boardRoutes);

// Ruta de prueba
app.get('/', (req: Request, res: Response) => {
  res.send('¡Servidor backend funcionando!');
});

// Manejador de errores
app.use(errorHandler);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});