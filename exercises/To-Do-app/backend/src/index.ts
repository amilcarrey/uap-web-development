import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes';
import boardRoutes from './routes/boardRoutes';
import { errorMiddleware } from './middlewares/errorMiddleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api', boardRoutes);

app.get('/', (req, res) => {
  res.send('¡API funcionando!');
});

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});