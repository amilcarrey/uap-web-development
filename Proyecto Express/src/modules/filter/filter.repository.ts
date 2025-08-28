import { database } from "../../db/connections";
import { Task } from "../../types";
import type { FilterParams } from "./filter.service";

export class FilterRepository {
  async filterTasks(params: FilterParams): Promise<{ tasks: Task[]; total: number }> {
    const { userId, activeBoardId, filter, page, limit } = params;

    const offset = (page - 1) * limit;

    let filterCondition = "";
    const filterParams: any[] = [userId, activeBoardId];

    if (filter === "completed") {
      filterCondition = "AND done = TRUE";
    } else if (filter === "incomplete") {
      filterCondition = "AND done = FALSE";
    }

    const countResult = await database.get<{ count: number }>(
      `SELECT COUNT(*) as count
      FROM tasks t
      JOIN board_users bu ON bu.board_id = t.activeBoardId
      WHERE bu.user_id = ? AND t.activeBoardId = ? 
      ${filterCondition}`,
      filterParams
    );

    const tasks = await database.all<Task>(
      `SELECT t.*
      FROM tasks t
      JOIN board_users bu ON bu.board_id = t.activeBoardId
      WHERE bu.user_id = ? AND t.activeBoardId = ?
      ${filterCondition}
      ORDER BY t.created_at DESC
      LIMIT ? OFFSET ?`,
      [...filterParams, limit, offset]
    );

    return { tasks, total: countResult?.count ?? 0 };
  }
}
