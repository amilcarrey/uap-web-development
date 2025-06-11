import { database } from "../../db/connection";
import {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  PaginationParams,
} from "../../types";
import { v4 as uuidv4 } from "uuid";
import { PaginationUtils } from "../../utils";

export class TaskRepository {
  async getTasksByBoard(
    boardId: string,
    paginationParams: PaginationParams
  ): Promise<{ tasks: Task[]; totalCount: number }> {
    const { page, limit, filter, search } = paginationParams;
    const { offset } = PaginationUtils.calculatePagination(page, limit, 0);

    // Build WHERE clause
    let whereClause = "WHERE board_id = ?";
    const params: any[] = [boardId];

    // Add filter conditions
    if (filter === "active") {
      whereClause += " AND completed = ?";
      params.push(false);
    } else if (filter === "completed") {
      whereClause += " AND completed = ?";
      params.push(true);
    }

    // Add search condition
    if (search && search.trim()) {
      whereClause += " AND text LIKE ?";
      params.push(`%${search.trim()}%`);
    }

    // Get total count for pagination
    const countResult = await database.get<{ count: number }>(
      `SELECT COUNT(*) as count FROM tasks ${whereClause}`,
      params
    );
    const totalCount = countResult?.count || 0;

    // Get tasks with pagination
    const tasks = await database.all<Task>(
      `SELECT * FROM tasks ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return { tasks, totalCount };
  }

  async getTaskById(id: string): Promise<Task | undefined> {
    return database.get<Task>("SELECT * FROM tasks WHERE id = ?", [id]);
  }

  async createTask(taskData: CreateTaskRequest): Promise<Task> {
    const id = uuidv4();
    const now = new Date().toISOString();

    await database.run(
      "INSERT INTO tasks (id, board_id, text, completed, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
      [id, taskData.board_id, taskData.text, false, now, now]
    );

    const task = await this.getTaskById(id);
    if (!task) {
      throw new Error("Failed to create task");
    }

    return task;
  }

  async updateTask(
    id: string,
    taskData: UpdateTaskRequest
  ): Promise<Task | undefined> {
    const now = new Date().toISOString();
    const fields: string[] = [];
    const values: any[] = [];

    if (taskData.text !== undefined) {
      fields.push("text = ?");
      values.push(taskData.text);
    }

    if (taskData.completed !== undefined) {
      fields.push("completed = ?");
      values.push(taskData.completed);
    }

    if (fields.length === 0) {
      return this.getTaskById(id);
    }

    fields.push("updated_at = ?");
    values.push(now, id);

    await database.run(
      `UPDATE tasks SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    return this.getTaskById(id);
  }

  async deleteTask(id: string): Promise<boolean> {
    await database.run("DELETE FROM tasks WHERE id = ?", [id]);
    return true;
  }

  async taskExists(id: string): Promise<boolean> {
    const task = await this.getTaskById(id);
    return !!task;
  }

  async clearCompletedTasks(boardId: string): Promise<number> {
    // SQLite doesn't directly return affected rows in the same way,
    // so we'll count them first
    const completedTasks = await database.get<{ count: number }>(
      "SELECT COUNT(*) as count FROM tasks WHERE board_id = ? AND completed = ?",
      [boardId, true]
    );

    await database.run(
      "DELETE FROM tasks WHERE board_id = ? AND completed = ?",
      [boardId, true]
    );

    return completedTasks?.count || 0;
  }

  async getTaskCountsByBoard(
    boardId: string
  ): Promise<{ total: number; completed: number; active: number }> {
    const totalResult = await database.get<{ count: number }>(
      "SELECT COUNT(*) as count FROM tasks WHERE board_id = ?",
      [boardId]
    );

    const completedResult = await database.get<{ count: number }>(
      "SELECT COUNT(*) as count FROM tasks WHERE board_id = ? AND completed = ?",
      [boardId, true]
    );

    const total = totalResult?.count || 0;
    const completed = completedResult?.count || 0;
    const active = total - completed;

    return { total, completed, active };
  }

  async getBoardIdByTaskId(taskId: string): Promise<string | undefined> {
    const task = await this.getTaskById(taskId);
    return task?.board_id;
  }
}
