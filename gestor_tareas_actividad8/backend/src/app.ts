import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
//import '../types/express';

dotenv.config();

const app = express();

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173', // o el puerto que uses en frontend
  credentials: true
}));

//rutas
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

export default app;





