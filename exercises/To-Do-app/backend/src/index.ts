import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import boardRoutes from './routes/boardRoutes';
import taskRoutes from './routes/taskRoutes';
import permissionRoutes from './routes/permissionRoutes';

dotenv.config();

const app = express();

// Configurar CORS
app.use(cors({
  origin: 'http://localhost:5173', // Origen del frontend
  credentials: true, // Permitir cookies (JWT)
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
}));

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api', permissionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});