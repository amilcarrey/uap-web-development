import express from 'express';
import cors from 'cors';

import usersRouter from './routes/users.routes';
import tareasRouter from './routes/task.routes';
import tablerosRouter from './routes/tableros.routes';
import permissionsRouter from './routes/permissions.routes';
import configuracionesRouter from './routes/configurations.routes';

const app = express();
const port = 4321;

// Configuración CORS para aceptar peticiones solo desde frontend 
app.use(cors({
  origin: 'http://localhost:5173',
}));

// Middleware para parsear JSON en las solicitudes
app.use(express.json());

// Rutas 
app.use('/api/users', usersRouter);
app.use('/api/tareas', tareasRouter);
app.use('/api/tableros', tablerosRouter);
app.use('/api/permisos', permissionsRouter);
app.use('/api/configuraciones', configuracionesRouter);

// Levantar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
