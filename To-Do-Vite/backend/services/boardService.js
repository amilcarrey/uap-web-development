const pool = require('../config/db');

const getBoardsForUser = async (userId) => {
    const result = await pool.query(
        `SELECT b.*, bu.role
         FROM boards b
         JOIN board_users bu ON bu.board_id = b.id
         WHERE bu.user_id = $1
         ORDER BY b.created_at DESC`,
        [userId]
    );
    return result.rows;
};

const createBoard = async (name, category, userId) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        const boardResult = await client.query(
            'INSERT INTO boards (name, category, user_id) VALUES ($1, $2, $3) RETURNING *',
            [name, category, userId]
        );
        const board = boardResult.rows[0];
        
        await client.query(
            'INSERT INTO board_users (board_id, user_id, role) VALUES ($1, $2, $3)',
            [board.id, userId, 'owner']
        );
        
        await client.query('COMMIT');
        return board;
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error en el servicio createBoard:', error);
        throw new Error('Error al crear el tablero');
    } finally {
        client.release();
    }
};

const deleteBoard = async (boardId) => {
    const result = await pool.query(
        'DELETE FROM boards WHERE id = $1 RETURNING *',
        [boardId]
    );
    return result.rows[0];
};

const shareBoard = async (boardId, usernameToShare, roleToAssign) => {
    const userResult = await pool.query('SELECT id FROM users WHERE username = $1', [usernameToShare]);
    if (userResult.rows.length === 0) {
        throw { status: 404, message: 'Usuario a compartir no encontrado' };
    }
    const invitedUserId = userResult.rows[0].id;

    const existingInvite = await pool.query(
        'SELECT * FROM board_users WHERE board_id = $1 AND user_id = $2',
        [boardId, invitedUserId]
    );
    if (existingInvite.rows.length > 0) {
        throw { status: 409, message: 'El usuario ya tiene acceso a este tablero' };
    }

    await pool.query(
        'INSERT INTO board_users (board_id, user_id, role) VALUES ($1, $2, $3)',
        [boardId, invitedUserId, roleToAssign]
    );

    return { message: 'Tablero compartido exitosamente' };
};

const getBoardUsers = async (boardId) => {
    const result = await pool.query(
        `SELECT u.username, bu.role
         FROM board_users bu
         JOIN users u ON u.id = bu.user_id
         WHERE bu.board_id = $1
         ORDER BY bu.role DESC, u.username`,
        [boardId]
    );
    return result.rows;
};

const removeUserFromBoard = async (boardId, usernameToRemove) => {
    const userResult = await pool.query('SELECT id FROM users WHERE username = $1', [usernameToRemove]);
    if (userResult.rows.length === 0) {
        throw { status: 404, message: 'Usuario a remover no encontrado' };
    }
    const userIdToRemove = userResult.rows[0].id;

    if (userIdToRemove === 1) { // Suponiendo que el superadmin tiene id 1 y no se puede eliminar
        throw { status: 403, message: 'No se puede remover al propietario original' };
    }

    const result = await pool.query(
        'DELETE FROM board_users WHERE board_id = $1 AND user_id = $2 RETURNING *',
        [boardId, userIdToRemove]
    );

    if (result.rowCount === 0) {
        throw { status: 404, message: 'El usuario no tiene acceso a este tablero' };
    }

    return { message: 'Usuario removido del tablero exitosamente' };
};


module.exports = {
    getBoardsForUser,
    createBoard,
    deleteBoard,
    shareBoard,
    getBoardUsers,
    removeUserFromBoard
}; 