// Configuración de la app Express
require('dotenv').config();
import express from 'express';
import cors from 'cors';
import boardRoutes from './routes/boardRoutes';
import taskRoutes from './routes/taskRoutes';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import permissionRoutes from './routes/permissionRoutes';
import preferenciaRoutes from './routes/preferenciaRoutes';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/errorHandler';
import { authMiddleware } from './middlewares/authMiddleware';

const app = express();

app.use(cookieParser(process.env.JWT_SECRET || "default_secret"));
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Rutas que NO necesitan autenticación
app.use('/api/auth', authRoutes);

// Rutas que SÍ necesitan autenticación (aplicamos middleware específicamente)
app.use('/api/users', userRoutes); // Rutas de usuario autenticadas
app.use('/api/boards', authMiddleware, boardRoutes); // Tableros del usuario autenticado
// app.use('/api/boards/:boardId/tasks', authMiddleware, taskRoutes); // Tareas de un tablero específico
//app.use('/api/boards/:boardId/permissions', authMiddleware, permissionRoutes);
app.use('/api/preferences', authMiddleware, preferenciaRoutes); // Preferencias del usuario autenticado



const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Documentación generada con Swagger',
    },
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Ajusta las rutas según tu estructura
};
const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware global para el manejo de errores
app.use(errorHandler);

export default app;
