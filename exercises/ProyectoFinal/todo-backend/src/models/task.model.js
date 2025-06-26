// src/models/task.model.js
const db = require('../config/db');

module.exports = {
  create: async ({ boardId, content }) => {
    const { rows } = await db.query(
      `INSERT INTO tasks (content, board_id)
       VALUES ($1, $2)
       RETURNING id, content, status, board_id, created_at, updated_at;`,
      [content, boardId]
    );
    return rows[0];
  },

 removeCompleted: async ({ boardId }) => {
    const { rowCount } = await db.query(
      `DELETE FROM tasks
       WHERE board_id = $1
         AND status = 'done';`,
      [boardId]
    );
    return rowCount;
  },

  // Lista tareas con filtros y paginación
  listByBoard: async ({ boardId, page, limit, status, search }) => {
    const offset = (page - 1) * limit;
    const clauses = ['board_id = $1'];
    const params = [boardId];

    if (status && status !== 'all') {
      params.push(status);
      clauses.push(`status = $${params.length}`);
    }
    if (search) {
      params.push(`%${search}%`);
      clauses.push(`content ILIKE $${params.length}`);
    }

    params.push(limit, offset);
    const { rows } = await db.query(
      `SELECT id, content, status, created_at
       FROM tasks
       WHERE ${clauses.join(' AND ')}
       ORDER BY created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length};`,
      params
    );
    return rows;
  },

  list: async ({ boardId, page, limit, status, search }) => {
    const offset = (page - 1) * limit;
    let baseQuery = `SELECT * FROM tasks WHERE board_id=$1`;
    const params = [boardId];

    if (status) {
      params.push(status);
      baseQuery += ` AND status=$${params.length}`;
    }
    if (search) {
      params.push(`%${search}%`);
      baseQuery += ` AND content ILIKE $${params.length}`;
    }
    baseQuery += ` ORDER BY created_at DESC LIMIT $${params.length+1} OFFSET $${params.length+2}`;

    params.push(limit, offset);
    const { rows } = await db.query(baseQuery, params);
    return rows;
  },

  update: async ({ taskId, content, status }) => {
    const fields = [];
    const params = [];
    if (content !== undefined) {
      params.push(content);
      fields.push(`content=$${params.length}`);
    }
    if (status !== undefined) {
      params.push(status);
      fields.push(`status=$${params.length}`);
    }
    params.push(taskId);
    const { rows } = await db.query(
      `UPDATE tasks SET ${fields.join(',')}, updated_at=NOW() WHERE id=$${params.length} RETURNING *;`,
      params
    );
    return rows[0];
  },

  remove: async ({ taskId }) => {
    await db.query(`DELETE FROM tasks WHERE id=$1;`, [taskId]);
  },

  removeCompleted: async ({ boardId }) => {
    const { rowCount } = await db.query(
      `DELETE FROM tasks
       WHERE board_id = $1
         AND status = 'done';`,
      [boardId]
    );
    return rowCount;
  },

  search: async ({ boardId, query }) => {
    const { rows } = await db.query(
      `SELECT * FROM tasks WHERE board_id=$1 AND content ILIKE $2;`,
      [boardId, `%${query}%`]
    );
    return rows;
  }
};
