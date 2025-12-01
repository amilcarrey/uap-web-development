import api from '../lib/api';
import { type Board, type MutateBoardData } from '../types';

export interface BoardExtended extends Board {
    permission_level?: string; // Agregado para permisos
}



    export const boardService = {
    // Obtener todos los tableros del usuario (con permisos)
    async getAllBoards(): Promise<BoardExtended[]> {
        const response = await api.get('/boards');
        return response.data;
    },

    // Obtener tablero específico
    async getBoardById(id: number): Promise<BoardExtended> {
        const response = await api.get(`/boards/${id}`);
        return response.data;
    },

    // Crear nuevo tablero
    async createBoard(data: MutateBoardData): Promise<BoardExtended> {
        const response = await api.post('/boards', data);
        return response.data;
    },

    // Actualizar tablero (solo con permisos de edición)
    async updateBoard(id: number, data: MutateBoardData): Promise<BoardExtended> {
        const response = await api.put(`/boards/${id}`, data);
        return response.data;
    },

    // Eliminar tablero (solo owners)
    async deleteBoard(id: number): Promise<void> {
        await api.delete(`/boards/${id}`);
    },

    //  Compartir tablero (solo owners)
    async shareBoard(boardId: number, email: string, permissionLevel: 'editor' | 'viewer'): Promise<any> {
        const response = await api.post(`/boards/${boardId}/share`, {
        email,
        permission_level: permissionLevel
        });
        return response.data;
    },

    // Obtener permisos del tablero
    async getBoardPermissions(boardId: number): Promise<any[]> {
        const response = await api.get(`/boards/${boardId}/permissions`);
        return response.data;
    }
};