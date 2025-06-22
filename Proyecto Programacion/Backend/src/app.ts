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

const app = express();


app.use(cookieParser(process.env.JWT_SECRET || "default_secret"));
app.use(cors());
app.use(express.json());
app.use('/api/board', boardRoutes);
app.use('/api/user', userRoutes);
app.use('/api/task', taskRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', permissionRoutes);
app.use('/api/preferences', preferenciaRoutes);


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

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

export default app;
