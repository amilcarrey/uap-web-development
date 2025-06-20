const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const pool = require('./config/db');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/auth');

const app = express();
const port = 3000;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Rutas de autenticación (públicas)
app.use('/auth', authRoutes);

// Función helper para verificar permisos
const checkBoardPermission = async (boardName, userId, requiredRole = 'viewer') => {
    console.log('checkBoardPermission:', { boardName, userId, requiredRole });
    
    const result = await pool.query(
        `SELECT b.id, bu.role 
         FROM boards b 
         JOIN board_users bu ON bu.board_id = b.id 
         WHERE b.name = $1 AND bu.user_id = $2`,
        [boardName, userId]
    );
    
    console.log('checkBoardPermission result:', result.rows);
    
    if (result.rows.length === 0) {
        console.log('No permissions found');
        return { hasPermission: false, boardId: null, role: null };
    }
    
    const { id: boardId, role } = result.rows[0];
    const roles = ['viewer', 'editor', 'owner'];
    const userRoleIndex = roles.indexOf(role);
    const requiredRoleIndex = roles.indexOf(requiredRole);
    
    const hasPermission = userRoleIndex >= requiredRoleIndex;
    console.log('Permission check:', { role, userRoleIndex, requiredRole, requiredRoleIndex, hasPermission });
    
    return {
        hasPermission,
        boardId,
        role
    };
};

// Función para generar token único
const generateToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

// Crear enlace compartido para un tablero
app.post('/boards/:name/share-link', authMiddleware, async (req, res) => {
    try {
        const { name } = req.params;
        const { expiresInDays = 30 } = req.body;
        
        const permission = await checkBoardPermission(name, req.user.userId, 'owner');
        
        if (!permission.hasPermission) {
            return res.status(403).json({ error: 'Solo el propietario puede crear enlaces compartidos' });
        }
        
        // Verificar si ya existe un enlace activo
        const existingLink = await pool.query(
            'SELECT * FROM shared_links WHERE board_id = $1 AND (expires_at IS NULL OR expires_at > NOW())',
            [permission.boardId]
        );
        
        if (existingLink.rows.length > 0) {
            return res.status(409).json({ 
                error: 'Ya existe un enlace compartido activo para este tablero',
                token: existingLink.rows[0].token
            });
        }
        
        // Crear nuevo enlace
        const token = generateToken();
        const expiresAt = expiresInDays ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000) : null;
        
        await pool.query(
            'INSERT INTO shared_links (board_id, token, expires_at) VALUES ($1, $2, $3)',
            [permission.boardId, token, expiresAt]
        );
        
        res.status(201).json({ 
            token,
            expiresAt,
            shareUrl: `http://localhost:5173/shared/${token}`
        });
    } catch (error) {
        console.error('Error al crear enlace compartido:', error);
        res.status(500).json({ error: 'Error al crear enlace compartido' });
    }
});

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

// Revocar enlace compartido
app.delete('/boards/:name/share-link', authMiddleware, async (req, res) => {
    try {
        const { name } = req.params;
        
        const permission = await checkBoardPermission(name, req.user.userId, 'owner');
        
        if (!permission.hasPermission) {
            return res.status(403).json({ error: 'Solo el propietario puede revocar enlaces compartidos' });
        }
        
        await pool.query(
            'DELETE FROM shared_links WHERE board_id = $1',
            [permission.boardId]
        );
        
        res.status(204).send();
    } catch (error) {
        console.error('Error al revocar enlace compartido:', error);
        res.status(500).json({ error: 'Error al revocar enlace compartido' });
    }
});

// Obtener todos los tableros donde el usuario tiene permisos
app.get('/boards', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT b.*, bu.role
             FROM boards b
             JOIN board_users bu ON bu.board_id = b.id
             WHERE bu.user_id = $1
             ORDER BY b.created_at DESC`,
            [req.user.userId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener tableros:', error);
        res.status(500).json({ error: 'Error al leer los tableros' });
    }
});

// Crear un nuevo tablero y asignar al creador como owner
app.post('/boards', authMiddleware, async (req, res) => {
    const client = await pool.connect();
    try {
        const { name, category } = req.body;
        if (!name || !category) {
            return res.status(400).json({ error: 'El nombre y la categoría son requeridos' });
        }
        if (!['Personal', 'Universidad'].includes(category)) {
            return res.status(400).json({ error: 'La categoría debe ser Personal o Universidad' });
        }
        
        await client.query('BEGIN');
        const boardResult = await client.query(
            'INSERT INTO boards (name, category, user_id) VALUES ($1, $2, $3) RETURNING *',
            [name, category, req.user.userId]
        );
        const board = boardResult.rows[0];
        await client.query(
            'INSERT INTO board_users (board_id, user_id, role) VALUES ($1, $2, $3)',
            [board.id, req.user.userId, 'owner']
        );
        await client.query('COMMIT');
        res.status(201).json(board);
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al crear tablero:', error);
        res.status(500).json({ error: 'Error al crear el tablero' });
    } finally {
        client.release();
    }
});

// Eliminar un tablero (solo owner)
app.delete('/boards/:name', authMiddleware, async (req, res) => {
    try {
        const { name } = req.params;
        const permission = await checkBoardPermission(name, req.user.userId, 'owner');
        
        if (!permission.hasPermission) {
            return res.status(403).json({ error: 'No tienes permisos para eliminar este tablero' });
        }
        
        const result = await pool.query(
            'DELETE FROM boards WHERE name = $1 RETURNING *',
            [name]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Tablero no encontrado' });
        }

        res.status(204).send();
    } catch (error) {
        console.error('Error al eliminar tablero:', error);
        res.status(500).json({ error: 'Error al eliminar el tablero' });
    }
});

// Obtener tareas de un tablero (viewer o superior)
app.get('/boards/:name/tasks', authMiddleware, async (req, res) => {
    try {
        const { name } = req.params;
        const permission = await checkBoardPermission(name, req.user.userId, 'viewer');
        
        if (!permission.hasPermission) {
            return res.status(403).json({ error: 'No tienes permisos para ver este tablero' });
        }
        
        const result = await pool.query(
            'SELECT t.* FROM tasks t WHERE t.board_id = $1 ORDER BY t.created_at DESC',
            [permission.boardId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener tareas:', error);
        res.status(500).json({ error: 'Error al leer las tareas' });
    }
});

// Crear una tarea (editor o superior)
app.post('/boards/:name/tasks', authMiddleware, async (req, res) => {
    try {
        const { name } = req.params;
        const { text } = req.body;
        
        if (!text) {
            return res.status(400).json({ error: 'El texto es requerido' });
        }

        const permission = await checkBoardPermission(name, req.user.userId, 'editor');
        
        if (!permission.hasPermission) {
            return res.status(403).json({ error: 'No tienes permisos para crear tareas en este tablero' });
        }

        const taskResult = await pool.query(
            'INSERT INTO tasks (board_id, text) VALUES ($1, $2) RETURNING *',
            [permission.boardId, text]
        );

        res.status(201).json(taskResult.rows[0]);
    } catch (error) {
        console.error('Error al crear tarea:', error);
        res.status(500).json({ error: 'Error al crear la tarea' });
    }
});

// Actualizar una tarea (editor o superior)
app.patch('/boards/:name/tasks/:taskId', authMiddleware, async (req, res) => {
    try {
        const { name, taskId } = req.params;
        const { completed, text } = req.body;
        
        const permission = await checkBoardPermission(name, req.user.userId, 'editor');
        
        if (!permission.hasPermission) {
            return res.status(403).json({ error: 'No tienes permisos para editar tareas en este tablero' });
        }

        let updateQuery = 'UPDATE tasks SET ';
        const queryParams = [];
        let paramCount = 1;

        if (completed !== undefined) {
            updateQuery += `completed = $${paramCount}, `;
            queryParams.push(completed);
            paramCount++;
        }

        if (text !== undefined) {
            updateQuery += `text = $${paramCount}, `;
            queryParams.push(text);
            paramCount++;
        }

        updateQuery = updateQuery.slice(0, -2);
        updateQuery += ` WHERE id = $${paramCount} AND board_id = $${paramCount + 1} RETURNING *`;
        queryParams.push(parseInt(taskId), permission.boardId);

        const result = await pool.query(updateQuery, queryParams);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Tarea no encontrada' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar tarea:', error);
        res.status(500).json({ error: 'Error al actualizar la tarea' });
    }
});

// Eliminar una tarea (editor o superior)
app.delete('/boards/:name/tasks/:taskId', authMiddleware, async (req, res) => {
    try {
        const { name, taskId } = req.params;
        
        const permission = await checkBoardPermission(name, req.user.userId, 'editor');
        
        if (!permission.hasPermission) {
            return res.status(403).json({ error: 'No tienes permisos para eliminar tareas en este tablero' });
        }

        const result = await pool.query(
            'DELETE FROM tasks WHERE id = $1 AND board_id = $2 RETURNING *',
            [parseInt(taskId), permission.boardId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Tarea no encontrada' });
        }

        res.status(204).send();
    } catch (error) {
        console.error('Error al eliminar tarea:', error);
        res.status(500).json({ error: 'Error al eliminar la tarea' });
    }
});

// Eliminar todas las tareas completadas (editor o superior)
app.delete('/boards/:name/tasks/completed', authMiddleware, async (req, res) => {
    try {
        const { name } = req.params;
        
        const permission = await checkBoardPermission(name, req.user.userId, 'editor');
        
        if (!permission.hasPermission) {
            return res.status(403).json({ error: 'No tienes permisos para eliminar tareas en este tablero' });
        }

        await pool.query(
            'DELETE FROM tasks WHERE board_id = $1 AND completed = true',
            [permission.boardId]
        );

        res.status(204).send();
    } catch (error) {
        console.error('Error al eliminar tareas completadas:', error);
        res.status(500).json({ error: 'Error al eliminar tareas completadas' });
    }
});

// Compartir tablero con otro usuario
app.post('/boards/:name/share', authMiddleware, async (req, res) => {
    try {
        const { name } = req.params;
        const { username, role } = req.body;
        
        if (!username || !role) {
            return res.status(400).json({ error: 'Usuario y rol son requeridos' });
        }
        
        if (!['viewer', 'editor'].includes(role)) {
            return res.status(400).json({ error: 'Rol debe ser viewer o editor' });
        }
        
        const permission = await checkBoardPermission(name, req.user.userId, 'owner');
        
        if (!permission.hasPermission) {
            return res.status(403).json({ error: 'Solo el propietario puede compartir el tablero' });
        }
        
        // Buscar el usuario a invitar
        const userResult = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        const invitedUserId = userResult.rows[0].id;
        
        // Verificar que no esté ya invitado
        const existingInvite = await pool.query(
            'SELECT * FROM board_users WHERE board_id = $1 AND user_id = $2',
            [permission.boardId, invitedUserId]
        );
        
        if (existingInvite.rows.length > 0) {
            return res.status(409).json({ error: 'El usuario ya tiene acceso a este tablero' });
        }
        
        // Agregar el usuario al tablero
        await pool.query(
            'INSERT INTO board_users (board_id, user_id, role) VALUES ($1, $2, $3)',
            [permission.boardId, invitedUserId, role]
        );
        
        res.status(201).json({ message: 'Tablero compartido exitosamente' });
    } catch (error) {
        console.error('Error al compartir tablero:', error);
        res.status(500).json({ error: 'Error al compartir el tablero' });
    }
});

// Obtener usuarios con acceso al tablero
app.get('/boards/:name/users', authMiddleware, async (req, res) => {
    try {
        const { name } = req.params;
        console.log('getBoardUsers called with:', { name, userId: req.user.userId });
        
        const permission = await checkBoardPermission(name, req.user.userId, 'viewer');
        console.log('Permission result:', permission);
        
        if (!permission.hasPermission) {
            console.log('No permission to view board');
            return res.status(403).json({ error: 'No tienes permisos para ver este tablero' });
        }
        
        console.log('Querying board users for boardId:', permission.boardId);
        const result = await pool.query(
            `SELECT u.username, bu.role
             FROM board_users bu
             JOIN users u ON u.id = bu.user_id
             WHERE bu.board_id = $1
             ORDER BY bu.role DESC, u.username`,
            [permission.boardId]
        );
        
        console.log('Board users result:', result.rows);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener usuarios del tablero:', error);
        res.status(500).json({ error: 'Error al obtener usuarios del tablero' });
    }
});

// Remover acceso de un usuario al tablero (solo owner)
app.delete('/boards/:name/users/:username', authMiddleware, async (req, res) => {
    try {
        const { name, username } = req.params;
        
        const permission = await checkBoardPermission(name, req.user.userId, 'owner');
        
        if (!permission.hasPermission) {
            return res.status(403).json({ error: 'Solo el propietario puede remover usuarios' });
        }
        
        // Buscar el usuario a remover
        const userResult = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        const userIdToRemove = userResult.rows[0].id;
        
        // No permitir remover al propietario
        if (userIdToRemove === req.user.userId) {
            return res.status(400).json({ error: 'No puedes removerte a ti mismo del tablero' });
        }
        
        // Remover el usuario
        const result = await pool.query(
            'DELETE FROM board_users WHERE board_id = $1 AND user_id = $2 RETURNING *',
            [permission.boardId, userIdToRemove]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'El usuario no tiene acceso a este tablero' });
        }
        
        res.status(204).send();
    } catch (error) {
        console.error('Error al remover usuario del tablero:', error);
        res.status(500).json({ error: 'Error al remover usuario del tablero' });
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
}); 