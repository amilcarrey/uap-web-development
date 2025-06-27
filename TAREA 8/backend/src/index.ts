import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route';
import protegidaRoutes from './routes/protegida.route';
import tableroRoutes from './routes/tablero.route';
import tareaRoutes from './routes/tarea.route';
import configuracionRoutes from './routes/configuracion.route';
import adminRoutes from './routes/admin.route';

dotenv.config();

const app = express();


const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: 'Demasiadas solicitudes desde esta IP, inténtalo de nuevo más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: 'Demasiados intentos de autenticación, inténtalo de nuevo más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});


app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
app.use(compression());



app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3002',
    process.env.FRONTEND_URL || 'http://localhost:3000'
  ],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());


app.use(generalLimiter);


app.use('/api/auth', authRoutes);
app.use('/api/protegida', protegidaRoutes);
app.use('/api/tableros', tableroRoutes);
app.use('/api/tareas', tareaRoutes);
app.use('/api/configuracion', configuracionRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (_req, res) => {
  res.send('API de tareas funcionando');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(` Servidor corriendo en puerto ${PORT}`);
  console.log(` Frontend URL: http://localhost:3000`);
  console.log(` API URL: http://localhost:${PORT}/api`);
});
