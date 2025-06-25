const { query, run } = require('../config/db');

const getTasks = async (boardId) => {
    const result = await query(
        'SELECT * FROM tasks WHERE board_id = ? ORDER BY created_at DESC',
        [boardId]
    );
    return result.rows;
};

const getTasksPaginated = async (boardId, page = 1, limit = 10, search = '', filter = 'all') => {
    const offset = (page - 1) * limit;
    
    let baseQuery = 'FROM tasks WHERE board_id = ?';
    let countQuery = 'SELECT COUNT(*) FROM tasks WHERE board_id = ?';
    let queryParams = [boardId];
    let paramCount = 1;

    if (search) {
        baseQuery += ` AND text LIKE ?`;
        countQuery += ` AND text LIKE ?`;
        queryParams.push(`%${search}%`);
    }

    if (filter === 'active') {
        baseQuery += ` AND completed = 0`;
        countQuery += ` AND completed = 0`;
    } else if (filter === 'completed') {
        baseQuery += ` AND completed = 1`;
        countQuery += ` AND completed = 1`;
    }

    const countResult = await query(countQuery, queryParams);
    const totalTasks = parseInt(countResult.rows[0]['COUNT(*)']);

    const tasksQuery = `SELECT * ${baseQuery} ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);
    
    const tasksResult = await query(tasksQuery, queryParams);

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
    const result = await run(
        'INSERT INTO tasks (board_id, text, completed) VALUES (?, ?, 0)',
        [boardId, text]
    );
    
    const taskResult = await query(
        'SELECT * FROM tasks WHERE id = ?',
        [result.rows[0].id]
    );
    
    return taskResult.rows[0];
};

const updateTask = async (taskId, updates) => {
    const { text, completed } = updates;
    const setClause = [];
    const values = [];
    let paramCount = 1;

    if (text !== undefined) {
        setClause.push(`text = ?`);
        values.push(text);
    }

    if (completed !== undefined) {
        setClause.push(`completed = ?`);
        values.push(completed ? 1 : 0);
    }

    if (setClause.length === 0) {
        throw new Error('No hay campos para actualizar');
    }

    values.push(taskId);
    const result = await run(
        `UPDATE tasks SET ${setClause.join(', ')} WHERE id = ?`,
        values
    );

    if (result.rowCount === 0) {
        throw { status: 404, message: 'Tarea no encontrada' };
    }

    // Obtener la tarea actualizada
    const taskResult = await query(
        'SELECT * FROM tasks WHERE id = ?',
        [taskId]
    );

    return taskResult.rows[0];
};

const deleteTask = async (taskId) => {
    const result = await run(
        'DELETE FROM tasks WHERE id = ?',
        [taskId]
    );

    if (result.rowCount === 0) {
        throw { status: 404, message: 'Tarea no encontrada' };
    }

    return { id: taskId };
};

const deleteCompletedTasks = async (boardId) => {
    const result = await run(
        'DELETE FROM tasks WHERE board_id = ? AND completed = 1',
        [boardId]
    );
    return { deletedCount: result.rowCount };
};

const getTaskById = async (taskId) => {
    const result = await query(
        'SELECT * FROM tasks WHERE id = ?',
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