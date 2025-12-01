import { TodoRepository } from "./todo.repository";
import { Todo, MutateTodoDto, TodoQueryParams, PaginatedResponse } from "../../types";

export class TodoService {
    constructor(private todoRepository: TodoRepository) {}

    async getAllTodos(board_id: number, data: TodoQueryParams): Promise<PaginatedResponse<Todo>> {
        return this.todoRepository.getAllTodos(board_id, data);
    }

    async getTodoById(board_id: number, id: number): Promise<Todo | undefined> {
        return this.todoRepository.getTodoById(board_id, id);
    }

    async createTodo(board_id: number, data: MutateTodoDto): Promise<Todo> {
        return this.todoRepository.createTodo(board_id, data);
    }

    async updateTodo(board_id: number, id: number, data: MutateTodoDto): Promise<Todo | undefined> {
        return this.todoRepository.updateTodo(board_id, id, data);
    }

    async toggleTodo(board_id: number, id: number): Promise<Todo | undefined> {
        return this.todoRepository.toggleTodo(board_id, id);
    }

    async deleteTodo(board_id: number, id: number): Promise<boolean> {
        return this.todoRepository.deleteTodo(board_id, id);
    }

    async clearCompletedTodos(board_id: number): Promise<number> {
        return this.todoRepository.clearCompletedTodos(board_id);
    }

    async todoExists(board_id: number, id: number): Promise<boolean> {
        return this.todoRepository.todoExists(board_id, id);
    }
}