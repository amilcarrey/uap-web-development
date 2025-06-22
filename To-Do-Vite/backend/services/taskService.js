const pool = require('../config/db');

const getTasks = async (boardId) => {
    const result = await pool.query(
        'SELECT * FROM tasks WHERE board_id = $1 ORDER BY created_at DESC',
        [boardId]
    );
    return result.rows;
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
    createTask,
    updateTask,
    deleteTask,
    deleteCompletedTasks,
    getTaskById
}; 