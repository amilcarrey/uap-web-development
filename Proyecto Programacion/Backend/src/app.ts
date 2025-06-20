// Configuración de la app Express
require('dotenv').config();
import express from 'express';
import cors from 'cors';
import boardRoutes from './routes/boardRoutes';
import taskRoutes from './routes/taskRoutes';
import userRoutes from './routes/userRoutes';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const app = express();
//argon2

app.use(cors());
app.use(express.json());
app.use('/api/boards', boardRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);


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

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

export default app;
