const express = require('express');
const pool = require('../config/db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Middleware para verificar que el usuario es admin (luca)
const adminMiddleware = (req, res, next) => {
    if (req.user.username !== 'luca') {
        return res.status(403).json({ 
            error: 'Acceso denegado. Solo el administrador puede acceder a esta funcionalidad.' 
        });
    }
    next();
};

// Aplicar middleware de autenticación y admin a todas las rutas
router.use(authMiddleware);
router.use(adminMiddleware);

// Obtener estadísticas del dashboard
router.get('/stats', async (req, res) => {
    try {
        const [usersCount, boardsCount, tasksCount] = await Promise.all([
            pool.query('SELECT COUNT(*) FROM users'),
            pool.query('SELECT COUNT(*) FROM boards'),
            pool.query('SELECT COUNT(*) FROM tasks')
        ]);

        res.json({
            users: parseInt(usersCount.rows[0].count),
            boards: parseInt(boardsCount.rows[0].count),
            tasks: parseInt(tasksCount.rows[0].count)
        });
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
});

// Obtener lista de usuarios con estadísticas
router.get('/users', async (req, res) => {
    try {
        const usersResult = await pool.query(`
            SELECT id, username, created_at
            FROM users
            ORDER BY created_at DESC
        `);
        
        const usersWithStats = await Promise.all(
            usersResult.rows.map(async (user) => {
                try {
                    const [boardsCount, tasksCount] = await Promise.all([
                        pool.query(`
                            SELECT COUNT(DISTINCT b.id) as count
                            FROM boards b
                            JOIN board_users bu ON b.id = bu.board_id
                            WHERE bu.user_id = $1
                        `, [user.id]),
                        pool.query(`
                            SELECT COUNT(DISTINCT t.id) as count
                            FROM tasks t
                            JOIN boards b ON t.board_id = b.id
                            JOIN board_users bu ON b.id = bu.board_id
                            WHERE bu.user_id = $1
                        `, [user.id])
                    ]);
                    
                    return {
                        ...user,
                        boards_count: parseInt(boardsCount.rows[0].count),
                        tasks_count: parseInt(tasksCount.rows[0].count)
                    };
                } catch (error) {
                    console.error(`Error obteniendo estadísticas para usuario ${user.id}:`, error);
                    return {
                        ...user,
                        boards_count: 0,
                        tasks_count: 0
                    };
                }
            })
        );
        
        res.json(usersWithStats);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
});

// Eliminar usuario y todos sus datos relacionados
router.delete('/users/:userId', async (req, res) => {
    const { userId } = req.params;
    
    try {
        const userExists = await pool.query('SELECT username FROM users WHERE id = $1', [userId]);
        if (userExists.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const username = userExists.rows[0].username;
        
        if (username === 'luca') {
            return res.status(400).json({ error: 'No se puede eliminar al administrador' });
        }

        const client = await pool.connect();
        
        try {
            await client.query('BEGIN');

            // Obtener tableros del usuario
            const userBoards = await client.query(`
                SELECT DISTINCT b.id 
                FROM boards b 
                JOIN board_users bu ON b.id = bu.board_id 
                WHERE bu.user_id = $1
            `, [userId]);

            // Eliminar tareas de los tableros del usuario
            for (const board of userBoards.rows) {
                await client.query('DELETE FROM tasks WHERE board_id = $1', [board.id]);
            }

            // Eliminar relaciones y tableros
            await client.query('DELETE FROM board_users WHERE user_id = $1', [userId]);
            await client.query('DELETE FROM boards WHERE id IN (SELECT board_id FROM board_users WHERE user_id = $1)', [userId]);
            await client.query('DELETE FROM users WHERE id = $1', [userId]);

            await client.query('COMMIT');

            res.json({ 
                message: `Usuario ${username} eliminado correctamente junto con todos sus tableros y tareas` 
            });
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
});

module.exports = router; 