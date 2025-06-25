const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const { query, queryOne } = require('./config/db');
const authRoutes = require('./routes/auth');
const boardRoutes = require('./routes/boardRoutes');
const taskRoutes = require('./routes/taskRoutes');
const adminRoutes = require('./routes/admin');
const settingsRoutes = require('./routes/settingsRoutes');
const authMiddleware = require('./middleware/auth');

const app = express();
const port = 3000;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);

app.use('/admin', adminRoutes);

app.use('/settings', settingsRoutes);

app.use('/boards/:boardName/tasks', (req, res, next) => {
    req.boardName = decodeURIComponent(req.params.boardName);
    next();
}, taskRoutes);

app.use('/boards', boardRoutes);

// Función para generar token único
const generateToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

// Obtener información del tablero compartido por token
app.get('/shared/:token', async (req, res) => {
    try {
        const { token } = req.params;
        
        const result = await query(
            `SELECT b.*, sl.expires_at
             FROM shared_links sl
             JOIN boards b ON b.id = sl.board_id
             WHERE sl.token = ? AND (sl.expires_at IS NULL OR sl.expires_at > datetime('now'))`,
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



app.listen(port, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});