import database from '../../db/connection';
import { Todo, MutateTodoDto, TodoQueryParams, PaginatedResponse } from '../../types';
import { v4 as uuidv4 } from 'uuid';

export class TodoRepository {
    async getAllTodos(board_id: number, data: TodoQueryParams): Promise<PaginatedResponse<Todo>> {
        const { 
            filter, 
            page = 1, 
            limit = 10, 
            search,
            priority,
            category,
            completed,
            sort_by = 'created_at',
            sort_order = 'asc',
            include_deleted = false
        } = data;

        console.log('[QUERY]', { filter, page, limit, search, priority, category, completed, sort_by, sort_order, include_deleted });
        
        const offset = (page - 1) * limit;

        // Build WHERE conditions
        let whereConditions = ['board_id = ?'];
        let queryParams: (number | string | boolean)[] = [board_id];
        let countParams: (number | string | boolean)[] = [board_id];

        // Soft delete filter (exclude deleted by default)
        if (!include_deleted) {
            whereConditions.push('is_deleted = 0');
        }

        // Legacy filter support
        if (filter === 'completed') {
            whereConditions.push('completed = 1');
        } else if (filter === 'uncompleted') {
            whereConditions.push('completed = 0');
        }

        // New completed parameter
        if (completed !== undefined) {
            whereConditions.push('completed = ?');
            const completedValue = completed ? 1 : 0;
            queryParams.push(completedValue);
            countParams.push(completedValue);
        }

        // Priority filter
        if (priority) {
            whereConditions.push('priority = ?');
            queryParams.push(priority);
            countParams.push(priority);
        }

        // Category filter
        if (category) {
            whereConditions.push('category = ?');
            queryParams.push(category);
            countParams.push(category);
        }

        // Text search (search in both text and description)
        if (search && search.trim() !== '') {
            const searchPattern = `%${search.trim()}%`;
            whereConditions.push('(text LIKE ? OR description LIKE ?)');
            queryParams.push(searchPattern, searchPattern);
            countParams.push(searchPattern, searchPattern);
        }

        const whereClause = whereConditions.join(' AND ');

        // Validate sort field
        const validSortFields = ['created_at', 'due_date', 'priority', 'text'];
        const sortField = validSortFields.includes(sort_by) ? sort_by : 'created_at';
        const sortDir = sort_order === 'desc' ? 'DESC' : 'ASC';

        // Get paginated todos
        const todos = await database.all<Todo>(
            `SELECT * FROM todos 
            WHERE ${whereClause}
            ORDER BY ${sortField} ${sortDir}
            LIMIT ? OFFSET ?`,
            [...queryParams, limit, offset]
        );

        // Get total count
        const total = await database.get<{ count: number }>(
            `SELECT COUNT(*) as count FROM todos
            WHERE ${whereClause}`,
            countParams
        );

        console.log('[QUERY RESULT]', { count: todos.length, total: total?.count });

        return { todos, total: total?.count || 0 };
    }

    async getTodoById(board_id: number, id: number,): Promise<Todo | undefined> {
        return database.get<Todo>(
            `SELECT * FROM todos 
            WHERE id = ? AND board_id = ?`,
            [id, board_id]
        );
    }

    async createTodo(board_id: number, data: MutateTodoDto): Promise<Todo> {
        const { text, description = '', priority = 'medium', category, due_date } = data;

        await database.run(
            `INSERT INTO todos (
                board_id, text, description, completed, priority, category, 
                due_date, is_deleted, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
            [board_id, text, description, false, priority, category || null, due_date || null, false]
        );

        const result = await database.get<{ id: number }>('SELECT last_insert_rowid() as id');
        const id = result?.id || 0;

        const todo = await this.getTodoById(board_id, id);
        if (!todo) {
            throw new Error('Failed to create todo');
        }
        
        return todo;
    }

    async updateTodo(board_id: number, id: number, data: MutateTodoDto): Promise<Todo | undefined> {
        const updateFields: string[] = [];
        const updateParams: (string | number | boolean | null)[] = [];

        if (data.text !== undefined) {
            updateFields.push('text = ?');
            updateParams.push(data.text);
        }
        if (data.description !== undefined) {
            updateFields.push('description = ?');
            updateParams.push(data.description);
        }
        if (data.priority !== undefined) {
            updateFields.push('priority = ?');
            updateParams.push(data.priority);
        }
        if (data.category !== undefined) {
            updateFields.push('category = ?');
            updateParams.push(data.category || null);
        }
        if (data.due_date !== undefined) {
            updateFields.push('due_date = ?');
            updateParams.push(data.due_date || null);
        }
        if (data.completed !== undefined) {
            updateFields.push('completed = ?');
            updateParams.push(data.completed ? 1 : 0);
        }

        if (updateFields.length === 0) {
            return this.getTodoById(board_id, id);
        }

        updateFields.push('updated_at = datetime("now")');
        updateParams.push(id, board_id);

        await database.run(
            `UPDATE todos 
            SET ${updateFields.join(', ')}
            WHERE id = ? AND board_id = ?`,
            updateParams
        );

        return this.getTodoById(board_id, id);
    }

    async toggleTodo(board_id: number, id: number): Promise<Todo | undefined> {
        const currentTodo = await database.get<{ completed: number }>(
        `SELECT completed FROM todos
        WHERE id = ? AND board_id = ?`,
        [id, board_id]
    );

        if (!currentTodo) {
            throw new Error('Todo not found');
        }

        const newCompletedValue = currentTodo.completed ? 0 : 1;

        await database.run(
            `UPDATE todos 
            SET completed = ?, updated_at = datetime('now') 
            WHERE id = ? AND board_id = ?`,
            [newCompletedValue, id, board_id]
        );

        return this.getTodoById(board_id, id);
    }

    async deleteTodo(board_id: number, id: number): Promise<boolean> {
        await database.run(
            `DELETE FROM todos 
            WHERE id = ? AND board_id = ?`, 
            [id, board_id]);
        return true;
    }

    // Soft delete: mark as deleted but keep in database
    async softDeleteTodo(board_id: number, id: number): Promise<Todo | undefined> {
        await database.run(
            `UPDATE todos 
            SET is_deleted = 1, deleted_at = datetime('now'), updated_at = datetime('now')
            WHERE id = ? AND board_id = ?`,
            [id, board_id]
        );
        return this.getTodoById(board_id, id);
    }

    // Hard delete: permanently remove from database
    async hardDeleteTodo(board_id: number, id: number): Promise<boolean> {
        await database.run(
            `DELETE FROM todos 
            WHERE id = ? AND board_id = ?`, 
            [id, board_id]
        );
        return true;
    }

    // Restore: undo soft delete
    async restoreTodo(board_id: number, id: number): Promise<Todo | undefined> {
        await database.run(
            `UPDATE todos 
            SET is_deleted = 0, deleted_at = NULL, updated_at = datetime('now')
            WHERE id = ? AND board_id = ?`,
            [id, board_id]
        );
        return this.getTodoById(board_id, id);
    }

    // Get soft deleted todos
    async getSoftDeletedTodos(board_id: number): Promise<Todo[]> {
        return database.all<Todo>(
            `SELECT * FROM todos 
            WHERE board_id = ? AND is_deleted = 1
            ORDER BY deleted_at DESC`,
            [board_id]
        );
    }

    // Get overdue todos (incomplete tasks with due_date in the past)
    async getOverdueTodos(board_id: number): Promise<Todo[]> {
        const now = new Date().toISOString();
        return database.all<Todo>(
            `SELECT * FROM todos 
            WHERE board_id = ? AND is_deleted = 0 AND completed = 0 AND due_date < ?
            ORDER BY due_date ASC`,
            [board_id, now]
        );
    }

    async clearCompletedTodos(board_id: number): Promise<number> {
        console.log("Clearing completed todos for board_id:", board_id);
        const countResult = await database.get<{ count: number }>(
            `SELECT COUNT(*) as count FROM todos WHERE board_id = ? AND completed = 1 AND is_deleted = 0`,
            [board_id]
        );
    
        await database.run(
            `UPDATE todos 
            SET is_deleted = 1, deleted_at = datetime('now'), updated_at = datetime('now')
            WHERE board_id = ? AND completed = 1 AND is_deleted = 0`, 
            [board_id]
        );
        return countResult?.count ?? 0;
    }

    async todoExists(board_id: number, id: number): Promise<boolean> {
        const todo = await this.getTodoById(board_id, id);
        return !!todo;
    }

    // Get comprehensive statistics for a board
    async getTaskStats(board_id: number): Promise<any> {
        const todos = await database.all<Todo>(
            `SELECT * FROM todos 
            WHERE board_id = ? AND is_deleted = 0`,
            [board_id]
        );

        const totalTasks = todos.length;
        const completedTasks = todos.filter(t => t.completed).length;
        const pendingTasks = totalTasks - completedTasks;
        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        // Stats by priority
        const byPriority = {
            high: {
                total: todos.filter(t => t.priority === 'high').length,
                completed: todos.filter(t => t.priority === 'high' && t.completed).length,
                pending: todos.filter(t => t.priority === 'high' && !t.completed).length
            },
            medium: {
                total: todos.filter(t => t.priority === 'medium').length,
                completed: todos.filter(t => t.priority === 'medium' && t.completed).length,
                pending: todos.filter(t => t.priority === 'medium' && !t.completed).length
            },
            low: {
                total: todos.filter(t => t.priority === 'low').length,
                completed: todos.filter(t => t.priority === 'low' && t.completed).length,
                pending: todos.filter(t => t.priority === 'low' && !t.completed).length
            }
        };

        // Stats by category
        const categories = ['work', 'personal', 'shopping', 'health', 'other'];
        const byCategory: any = {};
        categories.forEach(cat => {
            const catTodos = todos.filter(t => t.category === cat);
            byCategory[cat] = {
                total: catTodos.length,
                completed: catTodos.filter(t => t.completed).length,
                pending: catTodos.filter(t => !t.completed).length
            };
        });

        // Uncategorized tasks
        const unCategorized = todos.filter(t => !t.category);
        byCategory['sin_categoría'] = {
            total: unCategorized.length,
            completed: unCategorized.filter(t => t.completed).length,
            pending: unCategorized.filter(t => !t.completed).length
        };

        // Overdue tasks
        const now = new Date().toISOString();
        const overdueTasks = todos.filter(t => 
            !t.completed && t.due_date && t.due_date < now
        ).length;

        return {
            summary: {
                totalTasks,
                completedTasks,
                pendingTasks,
                completionRate,
                overdueTasks
            },
            byPriority,
            byCategory
        };
    }


}