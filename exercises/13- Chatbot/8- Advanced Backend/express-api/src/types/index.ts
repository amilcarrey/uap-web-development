export interface User {
    id: number;
    username: string;
    email: string;
    created_at: string;
    updated_at: string;
}

export interface UserWithPassword extends User {
    password_hash: string;
}

export interface Board {
    id: number;
    name: string;
    owner_id: number;
    created_at: string;
    updated_at: string;
}

export interface Todo {
    id: number;
    board_id: number;
    text: string;
    description?: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
    category?: 'work' | 'personal' | 'shopping' | 'health' | 'other';
    due_date?: string;
    is_deleted: boolean;
    deleted_at?: string;
    created_at: string;
    updated_at: string;
}

export interface BoardPermission {
    id: number;
    board_id: number;
    user_id: number;
    permission_level: 'owner' | 'editor' | 'viewer';
    created_at: string;
}

export interface UserSettings {
    id: number;
    user_id: number;
    refresh_interval: number;
    uppercase_descriptions: boolean;
    todos_per_page: number;
    created_at: string;
    updated_at: string;
}

// DTOs para la creación y actualización de entidades
export interface RegisterUserDto {
    username: string;
    email: string;
    password: string;
}

export interface LoginUserDto {
    email: string;
    password: string;
}

export interface MutateBoardDto {
    name: string;
}

export interface MutateTodoDto {
    text?: string;
    description?: string;
    completed?: boolean;
    priority?: 'low' | 'medium' | 'high';
    category?: 'work' | 'personal' | 'shopping' | 'health' | 'other';
    due_date?: string;
}

export interface ShareBoardDto {
    email: string;
    permission_level: 'editor' | 'viewer';
}

export interface UpdateSettingsDto {
    refresh_interval?: number;
    uppercase_descriptions?: boolean;
    todos_per_page?: number;
}

// Interfaces para las respuestas paginadas
export interface PaginatedResponse<T> {
        todos: T[];
        total: number; // total de todos del board, no de los que esta devolviendo
}

// Parámetros para las consultas
export interface TodoQueryParams {
    filter?: string;
    page?: number;
    limit?: number;
    search?: string;
    priority?: 'low' | 'medium' | 'high';
    category?: 'work' | 'personal' | 'shopping' | 'health' | 'other';
    completed?: boolean;
    sort_by?: 'created_at' | 'due_date' | 'priority' | 'text';
    sort_order?: 'asc' | 'desc';
    include_deleted?: boolean;
}

// JWT Payload
export interface JwtPayload {
    userId: number;
    email: string;
    username: string;
}

// Request con usuario autenticado
export interface AuthenticatedRequest extends Request {
    user?: User;
}

