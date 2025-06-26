//server.ts
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './src/routes/authRoutes';
import boardRoutes from './src/routes/boardRoutes';
import taskRoutes from './src/routes/taskRoutes';
import userRoutes from './src/routes/authRoutes';

dotenv.config();

const app = express();
app.use(express.json());


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, // necesario p cookies
}));


app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/boards', boardRoutes);
app.use("/api/tasks", taskRoutes);
app.use('/api/user', userRoutes);

// manejo de errores general (opcional)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
