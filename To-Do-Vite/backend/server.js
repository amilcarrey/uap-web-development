const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const pool = require('./config/db');
const authRoutes = require('./routes/auth');
const boardRoutes = require('./routes/boardRoutes');
const taskRoutes = require('./routes/taskRoutes');
const adminRoutes = require('./routes/admin');
const authMiddleware = require('./middleware/auth');

const app = express();
const port = 3000;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Rutas públicas
app.use('/auth', authRoutes);

// Rutas de administración (solo para luca)
app.use('/admin', adminRoutes);

// Rutas de tareas para cada tablero (deben ir antes que las rutas de tableros)
app.use('/boards/:boardName/tasks', (req, res, next) => {
    // Asegurar que el parámetro boardName esté disponible en las rutas hijas
    req.boardName = req.params.boardName;
    next();
}, taskRoutes);

// Rutas protegidas de tableros
app.use('/boards', boardRoutes);

// Función para generar token único
const generateToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

// Obtener información del tablero compartido por token
app.get('/shared/:token', async (req, res) => {
    try {
        const { token } = req.params;
        
        const result = await pool.query(
            `SELECT b.*, sl.expires_at
             FROM shared_links sl
             JOIN boards b ON b.id = sl.board_id
             WHERE sl.token = $1 AND (sl.expires_at IS NULL OR sl.expires_at > NOW())`,
            [token]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Enlace no válido o expirado' });
        }
        
        const board = result.rows[0];
        res.json(board);
    } catch (error) {
        console.error('Error al obtener tablero compartido:', error);
        res.status(500).json({ error: 'Error al obtener tablero compartido' });
    }
});

// Obtener tareas de un tablero compartido (solo lectura)
app.get('/shared/:token/tasks', async (req, res) => {
    try {
        const { token } = req.params;
        
        // Verificar que el enlace es válido
        const linkResult = await pool.query(
            `SELECT board_id FROM shared_links 
             WHERE token = $1 AND (expires_at IS NULL OR expires_at > NOW())`,
            [token]
        );
        
        if (linkResult.rows.length === 0) {
            return res.status(404).json({ error: 'Enlace no válido o expirado' });
        }
        
        const boardId = linkResult.rows[0].board_id;
        
        const result = await pool.query(
            'SELECT * FROM tasks WHERE board_id = $1 ORDER BY created_at DESC',
            [boardId]
        );
        
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener tareas del tablero compartido:', error);
        res.status(500).json({ error: 'Error al obtener tareas' });
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
}); 