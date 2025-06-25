const express = require('express');
const { query, run } = require('../config/db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Middleware para ver si el usuario es admin
const adminMiddleware = (req, res, next) => {
    if (req.user.username !== 'luca') {
        return res.status(403).json({ 
            error: 'Acceso denegado. Solo el administrador puede acceder a esta funcionalidad.' 
        });
    }
    next();
};

router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/stats', async (req, res) => {
    try {
        const [usersCount, boardsCount, tasksCount] = await Promise.all([
            query('SELECT COUNT(*) FROM users'),
            query('SELECT COUNT(*) FROM boards'),
            query('SELECT COUNT(*) FROM tasks')
        ]);

        res.json({
            users: parseInt(usersCount.rows[0]['COUNT(*)']),
            boards: parseInt(boardsCount.rows[0]['COUNT(*)']),
            tasks: parseInt(tasksCount.rows[0]['COUNT(*)'])
        });
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
});

router.get('/users', async (req, res) => {
    try {
        const usersResult = await query(`
            SELECT id, username, created_at
            FROM users
            ORDER BY created_at DESC
        `);
        
        const usersWithStats = await Promise.all(
            usersResult.rows.map(async (user) => {
                try {
                    const [boardsCount, tasksCount] = await Promise.all([
                        query(`
                            SELECT COUNT(DISTINCT b.id) as count
                            FROM boards b
                            JOIN board_users bu ON b.id = bu.board_id
                            WHERE bu.user_id = ?
                        `, [user.id]),
                        query(`
                            SELECT COUNT(DISTINCT t.id) as count
                            FROM tasks t
                            JOIN boards b ON t.board_id = b.id
                            JOIN board_users bu ON b.id = bu.board_id
                            WHERE bu.user_id = ?
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
        const userExists = await query('SELECT username FROM users WHERE id = ?', [userId]);
        if (userExists.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const username = userExists.rows[0].username;
        
        if (username === 'luca') {
            return res.status(400).json({ error: 'No se puede eliminar al administrador' });
        }

        const userBoards = await query(`
            SELECT DISTINCT b.id 
            FROM boards b 
            JOIN board_users bu ON b.id = bu.board_id 
            WHERE bu.user_id = ?
        `, [userId]);

        const boardIds = userBoards.rows.map(board => board.id);

        if (boardIds.length > 0) {
            await run('DELETE FROM tasks WHERE board_id IN (' + boardIds.map(() => '?').join(',') + ')', boardIds);
            
            await run('DELETE FROM shared_links WHERE board_id IN (' + boardIds.map(() => '?').join(',') + ')', boardIds);
            
            await run('DELETE FROM board_users WHERE board_id IN (' + boardIds.map(() => '?').join(',') + ')', boardIds);
            
            await run('DELETE FROM boards WHERE id IN (' + boardIds.map(() => '?').join(',') + ')', boardIds);
        }

        // Eliminar el usuario
        await run('DELETE FROM users WHERE id = ?', [userId]);

        res.json({ 
            message: `Usuario ${username} eliminado correctamente junto con todos sus tableros y tareas` 
        });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
});

module.exports = router;
