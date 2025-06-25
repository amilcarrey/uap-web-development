const { query } = require('../config/db');

const checkBoardPermission = async (boardName, userId, requiredRole = 'viewer') => {
    const result = await query(
        `SELECT b.id, b.user_id as owner_id, bu.role 
         FROM boards b 
         LEFT JOIN board_users bu ON bu.board_id = b.id AND bu.user_id = ?
         WHERE b.name = ?`,
        [userId, boardName]
    );
    
    if (result.rows.length === 0) {
        return { hasPermission: false, boardId: null, role: null, error: 'Tablero no encontrado', status: 404 };
    }
    
    const { id: boardId, owner_id, role } = result.rows[0];
    const userRole = owner_id === userId ? 'owner' : role;

    if (!userRole) {
        return { hasPermission: false, boardId, role: null, error: 'No tienes permisos para acceder a este tablero', status: 403 };
    }

    const roles = ['viewer', 'editor', 'owner'];
    const userRoleIndex = roles.indexOf(userRole);
    const requiredRoleIndex = roles.indexOf(requiredRole);
    
    const hasPermission = userRoleIndex >= requiredRoleIndex;
    
    if (!hasPermission) {
        return { hasPermission: false, boardId, role: userRole, error: `No tienes permisos suficientes. Se requiere rol de '${requiredRole}'`, status: 403 };
    }
    
    return {
        hasPermission: true,
        boardId,
        role: userRole
    };
};

module.exports = {
    checkBoardPermission
}; 