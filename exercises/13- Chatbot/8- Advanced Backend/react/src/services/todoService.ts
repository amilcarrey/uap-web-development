import api from '../lib/api';
import { type PaginatedResponse, type TodoItem as Todo, type TodoQueryParams } from '../types';

export interface CreateTodoData {
    text: string;
} 

export const todoService = {
    // Obtener todos del tablero con filtros
    async getAllTodos(boardId: number, params?: TodoQueryParams): Promise<PaginatedResponse<Todo>> {
        const response = await api.get(`/boards/${boardId}/todos`, { params });
        return response.data;
    },

    // Crear nueva tarea
    async createTodo(boardId: number, data: CreateTodoData): Promise<Todo> {
        const response = await api.post(`/boards/${boardId}/todos`, data);
        return response.data;
    },

    // Actualizar tarea
    async updateTodo(boardId: number, todoId: number, data: Partial<CreateTodoData>): Promise<Todo> {
        const response = await api.put(`/boards/${boardId}/todos/${todoId}`, data);
        return response.data;
    },

    // Toggle completado
    async toggleTodo(boardId: number, todoId: number): Promise<Todo> {
        const response = await api.patch(`/boards/${boardId}/todos/${todoId}/toggle`);
        return response.data;
    },

    // Eliminar tarea
    async deleteTodo(boardId: number, todoId: number): Promise<void> {
        await api.delete(`/boards/${boardId}/todos/${todoId}`);
    },

    // Limpiar completadas
    async clearCompleted(boardId: number): Promise<number> {
        // console.log("Clearing completed todos for board:", boardId);
        const response = await api.delete(`/boards/${boardId}/todos/clear-completed`);
        // console.log("Clear completed response:", response);
        return response.data;
    }
};