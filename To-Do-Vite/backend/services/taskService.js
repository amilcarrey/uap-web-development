const pool = require('../config/db');

const getTasks = async (boardId) => {
    const result = await pool.query(
        'SELECT * FROM tasks WHERE board_id = $1 ORDER BY created_at DESC',
        [boardId]
    );
    return result.rows;
};

const getTasksPaginated = async (boardId, page = 1, limit = 10, search = '', filter = 'all') => {
    const offset = (page - 1) * limit;
    
    // Construir la consulta base
    let baseQuery = 'FROM tasks WHERE board_id = $1';
    let countQuery = 'SELECT COUNT(*) FROM tasks WHERE board_id = $1';
    let queryParams = [boardId];
    let paramCount = 1;

    // Agregar filtros
    if (search) {
        baseQuery += ` AND text ILIKE $${++paramCount}`;
        countQuery += ` AND text ILIKE $${paramCount}`;
        queryParams.push(`%${search}%`);
    }

    if (filter === 'active') {
        baseQuery += ` AND completed = false`;
        countQuery += ` AND completed = false`;
    } else if (filter === 'completed') {
        baseQuery += ` AND completed = true`;
        countQuery += ` AND completed = true`;
    }

    // Obtener el total de registros
    const countResult = await pool.query(countQuery, queryParams);
    const totalTasks = parseInt(countResult.rows[0].count);

    // Obtener las tareas paginadas
    const tasksQuery = `SELECT * ${baseQuery} ORDER BY created_at DESC LIMIT $${++paramCount} OFFSET $${++paramCount}`;
    queryParams.push(limit, offset);
    
    const tasksResult = await pool.query(tasksQuery, queryParams);

    return {
        tasks: tasksResult.rows,
        pagination: {
            page,
            limit,
            totalTasks,
            totalPages: Math.ceil(totalTasks / limit),
            hasNextPage: page < Math.ceil(totalTasks / limit),
            hasPrevPage: page > 1
        }
    };
};

const createTask = async (boardId, text) => {
    const result = await pool.query(
        'INSERT INTO tasks (board_id, text, completed) VALUES ($1, $2, false) RETURNING *',
        [boardId, text]
    );
    return result.rows[0];
};

const updateTask = async (taskId, updates) => {
    const { text, completed } = updates;
    const setClause = [];
    const values = [];
    let paramCount = 1;

    if (text !== undefined) {
        setClause.push(`text = $${paramCount++}`);
        values.push(text);
    }

    if (completed !== undefined) {
        setClause.push(`completed = $${paramCount++}`);
        values.push(completed);
    }

    if (setClause.length === 0) {
        throw new Error('No hay campos para actualizar');
    }

    values.push(taskId);
    const result = await pool.query(
        `UPDATE tasks SET ${setClause.join(', ')} WHERE id = $${paramCount} RETURNING *`,
        values
    );

    if (result.rows.length === 0) {
        throw { status: 404, message: 'Tarea no encontrada' };
    }

    return result.rows[0];
};

const deleteTask = async (taskId) => {
    const result = await pool.query(
        'DELETE FROM tasks WHERE id = $1 RETURNING *',
        [taskId]
    );

    if (result.rows.length === 0) {
        throw { status: 404, message: 'Tarea no encontrada' };
    }

    return result.rows[0];
};

const deleteCompletedTasks = async (boardId) => {
    const result = await pool.query(
        'DELETE FROM tasks WHERE board_id = $1 AND completed = true RETURNING *',
        [boardId]
    );
    return result.rows;
};

const getTaskById = async (taskId) => {
    const result = await pool.query(
        'SELECT * FROM tasks WHERE id = $1',
        [taskId]
    );

    if (result.rows.length === 0) {
        throw { status: 404, message: 'Tarea no encontrada' };
    }

    return result.rows[0];
};

module.exports = {
    getTasks,
    getTasksPaginated,
    createTask,
    updateTask,
    deleteTask,
    deleteCompletedTasks,
    getTaskById
}; 