import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import boardRoutes from './routes/board.routes';
//import '../types/express';
import shareRoutes from './routes/share.routes';

dotenv.config();

const app = express();

//middlewares

app.use('/share', shareRoutes);
app.use(express.json());
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

//rutas
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/boards', boardRoutes);

export default app;





