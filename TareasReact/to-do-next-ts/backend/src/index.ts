import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import tareasRoutes from './routes/tareaRoutes';
import tableroRoutes from './routes/tableroRoutes';
import authRoutes from './routes/authRoutes';
import configRoutes from './routes/configRoutes';

console.log('JWT_SECRET cargado:', process.env.JWT_SECRET);

const allowedOrigins = ['http://localhost:3000', 'http://localhost:5137'];
const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tareas', tareasRoutes);
app.use('/api/tableros', tableroRoutes);
app.use('/api/config', configRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(4000, () => {
  console.log('Servidor escuchando en http://localhost:4000');
});

