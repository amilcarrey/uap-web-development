export interface User {
    id: number;
    username: string;
    email: string;
    created_at: string;
    updated_at: string;
}

export interface TodoItem {
    id: number;
    board_id: number;
    text: string;
    completed: boolean;
    created_at: string;
    updated_at: string;
}

export interface Board {
    id: number;
    name: string;
    owner_id: number;
    created_at: string;
    updated_at: string;
}

export interface TodoQueryParams {
    filter?: 'all' | 'completed' | 'uncompleted';
    page?: number;
    limit?: number;
    search?: string;
}

export interface PaginatedResponse<T> {
        todos: T[];
        total: number; // total de todos del board, no de los que esta devolviendo
}

export interface RegisterData {
    username: string;
    email: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface UserSettings {
    refresh_interval: number;
    uppercase_descriptions: boolean;
    todos_per_page: number;
}

// ✅ Nuevos tipos para permisos de tableros
export interface BoardPermission {
    id: number;
    board_id: number;
    user_id: number;
    permission_level: 'owner' | 'editor' | 'viewer';
    created_at: string;
    username?: string; // Para mostrar el nombre del usuario
    email?: string; // Para mostrar el email del usuario
}

export interface ShareBoardData {
    board_id: number;
    user_email: string;
    permission_level: 'editor' | 'viewer';
}

export interface BoardWithPermissions extends Board {
    permissions?: BoardPermission[];
    user_permission?: 'owner' | 'editor' | 'viewer';
    owner?: {
        id: number;
        username: string;
        email: string;
    };
}

// ✅ Nuevo tipo para la respuesta del backend de tableros accesibles
export interface AccessibleBoard {
    id: number;
    name: string;
    owner_id: number;
    created_at: string;
    updated_at: string;
    user_permission: 'owner' | 'editor' | 'viewer'; // El permiso del usuario actual
    owner_username: string; // Nombre del propietario del tablero
    owner_email: string; // Email del propietario
}

export interface MutateBoardData {
    name: string; 
}

export interface MutateTodoData {
    text: string; 
}

export type filterType = 'all' | 'completed' | 'uncompleted';