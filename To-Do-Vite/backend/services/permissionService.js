const pool = require('../config/db');

const checkBoardPermission = async (boardName, userId, requiredRole = 'viewer') => {
    console.log('🔍 checkBoardPermission - Iniciando...');
    console.log('🔍 boardName:', boardName);
    console.log('🔍 userId:', userId);
    console.log('🔍 requiredRole:', requiredRole);
    
    const result = await pool.query(
        `SELECT b.id, b.user_id as owner_id, bu.role 
         FROM boards b 
         LEFT JOIN board_users bu ON bu.board_id = b.id AND bu.user_id = $2
         WHERE b.name = $1`,
        [boardName, userId]
    );
    
    console.log('🔍 Resultado de la consulta:', result.rows);
    
    if (result.rows.length === 0) {
        console.log('❌ Tablero no encontrado');
        return { hasPermission: false, boardId: null, role: null, error: 'Tablero no encontrado', status: 404 };
    }
    
    const { id: boardId, owner_id, role } = result.rows[0];
    const userRole = owner_id === userId ? 'owner' : role;

    console.log('🔍 boardId:', boardId);
    console.log('🔍 owner_id:', owner_id);
    console.log('🔍 role:', role);
    console.log('🔍 userRole calculado:', userRole);

    if (!userRole) {
        console.log('❌ Usuario sin rol');
        return { hasPermission: false, boardId, role: null, error: 'No tienes permisos para acceder a este tablero', status: 403 };
    }

    const roles = ['viewer', 'editor', 'owner'];
    const userRoleIndex = roles.indexOf(userRole);
    const requiredRoleIndex = roles.indexOf(requiredRole);
    
    const hasPermission = userRoleIndex >= requiredRoleIndex;
    
    console.log('🔍 userRoleIndex:', userRoleIndex);
    console.log('🔍 requiredRoleIndex:', requiredRoleIndex);
    console.log('🔍 hasPermission:', hasPermission);
    
    if (!hasPermission) {
        console.log('❌ Permisos insuficientes');
        return { hasPermission: false, boardId, role: userRole, error: `No tienes permisos suficientes. Se requiere rol de '${requiredRole}'`, status: 403 };
    }
    
    console.log('✅ Permisos verificados correctamente');
    return {
        hasPermission: true,
        boardId,
        role: userRole
    };
};

module.exports = {
    checkBoardPermission
}; 