require('dotenv').config();
import express from 'express';
import cors from 'cors';
import boardRoutes from './routes/boardRoutes';
import taskRoutes from './routes/taskRoutes';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import permissionRoutes from './routes/permissionRoutes';
import preferenciaRoutes from './routes/preferenciaRoutes';
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

app.use('/api/auth', authRoutes);

app.use('/api/users', userRoutes);
app.use('/api/boards', authMiddleware, boardRoutes);
app.use('/api/preferences', authMiddleware, preferenciaRoutes);


app.use(errorHandler);

export default app;
