import { database } from "../../db/connections";
import { Task, CreateTaskRequest } from "../../types";
import { v4 as uuidv4 } from "uuid";

export class TaskRepository {
  async getAllTasks(): Promise<Task[]> {
    return database.all<Task>("SELECT * FROM tasks ORDER BY created_at DESC");
  }

  async getTaskById(id: string): Promise<Task | undefined> {
    return database.get<Task>("SELECT * FROM tasks WHERE id = ?", [id]);
  }

  async createTask(taskData: CreateTaskRequest): Promise<Task> {
    const id = uuidv4();
    const now = new Date().toISOString();

    await database.run(
      "INSERT INTO tasks (id, text, created_at, updated_at, activeBoardId, done) VALUES (?, ?, ?, ?, ?, ?)",
      [id, taskData.text || null, now, now, taskData.activeBoardId || null, false]
    );

    const task = await this.getTaskById(id);
    if (!task) {
      throw new Error("Failed to create task");
    }

    return task;
  }

  async deleteTask(id: string): Promise<boolean> {
    await database.run("DELETE FROM tasks WHERE id = ?", [id]);
    return true;
  }

  async updateTask(id: string, newText:string): Promise<Task> {
    const existingTask = await this.getTaskById(id);
    if (!existingTask) {
        throw new Error("Task not found");
    }

    const updatedAt = new Date().toISOString();

    await database.run(
        "UPDATE tasks SET text = ?, updated_at = ? WHERE id = ?",
        [newText, updatedAt, id]
    );

    const updatedTask = await this.getTaskById(id);
    if (!updatedTask) {
        throw new Error("Failed to update task")
    }

    return updatedTask;
  }

  async toggleTask(id: string): Promise<Task> {
    const existingTask = await this.getTaskById(id);
    if (!existingTask) {
        throw new Error("Task not found");
    }

    const newDoneStatus = !existingTask.done;
    const updatedAt = new Date().toISOString();

    await database.run(
        "UPDATE tasks SET done = ?, updated_at = ? WHERE id = ?",
        [newDoneStatus, updatedAt, id]
    );

    const updatedTask = await this.getTaskById(id);
    if (!updatedTask) {
        throw new Error("Failed to toggle task");
    }

    return updatedTask;
  }

  async clearCompleted(activeBoardId: string): Promise<void> {
    await database.run(
      `DELETE FROM tasks 
      WHERE done = TRUE
      AND activeBoardId = ?`,
      [activeBoardId]
    );
  }

  async taskExists(id: string): Promise<boolean> {
    const task = await this.getTaskById(id);
    return !!task;
  } 
}