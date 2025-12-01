import api from '../lib/api';
import { type BoardPermission, type ShareBoardData, type BoardWithPermissions } from '../types';

export const permissionsService = {
    // Obtener permisos de un tablero específico
    async getBoardPermissions(boardId: number): Promise<BoardPermission[]> {
        try {
            const response = await api.get(`/boards/${boardId}/permissions`);
            return response.data;
        } catch (error) {
            console.error('Get board permissions error:', error);
            throw error;
        }
    },

    // Compartir tablero con un usuario
    async shareBoard(data: ShareBoardData): Promise<BoardPermission> {
        try {
            const response = await api.post(`/boards/${data.board_id}/share`, {
                email: data.user_email, // ✅ Backend espera 'email', no 'user_email'
                permission_level: data.permission_level
            });
            return response.data;
        } catch (error) {
            console.error('Share board error:', error);
            throw error;
        }
    },

    // Actualizar permisos de un usuario en un tablero
    async updateBoardPermission(boardId: number, userId: number, permission_level: 'editor' | 'viewer'): Promise<BoardPermission> {
        try {
            const response = await api.put(`/boards/${boardId}/permissions/${userId}`, {
                permission_level
            });
            return response.data;
        } catch (error) {
            console.error('Update board permission error:', error);
            throw error;
        }
    },

    // Remover permisos de un usuario en un tablero
    async removeBoardPermission(boardId: number, userId: number): Promise<void> {
        try {
            await api.delete(`/boards/${boardId}/permissions/${userId}`);
        } catch (error) {
            console.error('Remove board permission error:', error);
            throw error;
        }
    },

    // Obtener todos los tableros accesibles por el usuario (incluye propios y compartidos)
    async getAccessibleBoards(): Promise<BoardWithPermissions[]> {
        try {
            const response = await api.get('/boards/accessible');
            return response.data;
        } catch (error) {
            console.error('Get accessible boards error:', error);
            throw error;
        }
    }
};
