import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'; 
import boardRouter from './routes/board.routes';
import authRouter from './routes/auth.routes';
import { requestLogger } from './middleware/request-logger.middleware';
import { errorHandler } from './middleware/error.middleware';
import database from './db/connection';  // Importar la instancia de la base de datos para inicializarla
import chatRoutes from './routes/chat.routes';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'], // Para React (ambos puertos)
    credentials: true // Permitir cookies
}));
app.use(express.json());
app.use(cookieParser()); 
app.use(requestLogger);

// Rutas
app.use('/api/auth', authRouter); 
app.use('/api/boards', boardRouter);
app.use('/api/chat', chatRoutes);

// Manejo de errores
app.use(errorHandler);

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// 404 handler
app.use("*", (req, res) => {
    res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
    console.log("SIGTERM received, shutting down gracefully");
    process.exit(0);
});

process.on("SIGINT", () => {
    console.log("SIGINT received, shutting down gracefully");
    process.exit(0);
});


