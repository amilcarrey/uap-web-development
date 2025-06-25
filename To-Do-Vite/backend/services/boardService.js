const { query, run } = require('../config/db');

const getBoardsForUser = async (userId) => {
    const result = await query(
        `SELECT b.*, bu.role
         FROM boards b
         JOIN board_users bu ON bu.board_id = b.id
         WHERE bu.user_id = ?
         ORDER BY b.created_at DESC`,
        [userId]
    );
    return result.rows;
};

const createBoard = async (name, category, userId) => {
    try {
        const boardResult = await run(
            'INSERT INTO boards (name, category, user_id) VALUES (?, ?, ?)',
            [name, category, userId]
        );
        
        const boardId = boardResult.rows[0].id;
        
        const boardQuery = await query(
            'SELECT * FROM boards WHERE id = ?',
            [boardId]
        );
        
        const board = boardQuery.rows[0];
        
        await run(
            'INSERT INTO board_users (board_id, user_id, role) VALUES (?, ?, ?)',
            [boardId, userId, 'owner']
        );
        
        return board;
    } catch (error) {
        console.error('Error en el servicio createBoard:', error);
        throw new Error('Error al crear el tablero');
    }
};

const deleteBoard = async (boardId) => {
    const result = await run(
        'DELETE FROM boards WHERE id = ?',
        [boardId]
    );
    
    if (result.rowCount === 0) {
        throw { status: 404, message: 'Tablero no encontrado' };
    }
    
    return { id: boardId };
};

const shareBoard = async (boardId, usernameToShare, roleToAssign) => {
    const userResult = await query('SELECT id FROM users WHERE username = ?', [usernameToShare]);
    if (userResult.rows.length === 0) {
        throw { status: 404, message: 'Usuario a compartir no encontrado' };
    }
    const invitedUserId = userResult.rows[0].id;

    const existingInvite = await query(
        'SELECT * FROM board_users WHERE board_id = ? AND user_id = ?',
        [boardId, invitedUserId]
    );
    if (existingInvite.rows.length > 0) {
        throw { status: 409, message: 'El usuario ya tiene acceso a este tablero' };
    }

    await run(
        'INSERT INTO board_users (board_id, user_id, role) VALUES (?, ?, ?)',
        [boardId, invitedUserId, roleToAssign]
    );

    return { message: 'Tablero compartido exitosamente' };
};

const getBoardUsers = async (boardId) => {
    const result = await query(
        `SELECT u.username, bu.role
         FROM board_users bu
         JOIN users u ON u.id = bu.user_id
         WHERE bu.board_id = ?
         ORDER BY bu.role DESC, u.username`,
        [boardId]
    );
    return result.rows;
};

const removeUserFromBoard = async (boardId, usernameToRemove) => {
    const userResult = await query('SELECT id FROM users WHERE username = ?', [usernameToRemove]);
    if (userResult.rows.length === 0) {
        throw { status: 404, message: 'Usuario a remover no encontrado' };
    }
    const userIdToRemove = userResult.rows[0].id;

    const boardOwnerResult = await query(
        'SELECT user_id FROM boards WHERE id = ?',
        [boardId]
    );
    
    if (boardOwnerResult.rows.length > 0 && boardOwnerResult.rows[0].user_id === userIdToRemove) {
        throw { status: 403, message: 'No se puede remover al propietario del tablero' };
    }

    const existingAccess = await query(
        'SELECT * FROM board_users WHERE board_id = ? AND user_id = ?',
        [boardId, userIdToRemove]
    );

    if (existingAccess.rows.length === 0) {
        throw { status: 404, message: 'El usuario no tiene acceso a este tablero' };
    }

    const result = await run(
        'DELETE FROM board_users WHERE board_id = ? AND user_id = ?',
        [boardId, userIdToRemove]
    );

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