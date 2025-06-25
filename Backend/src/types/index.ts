export interface User {
    id: string;   
    email: string;
    password: string;
    name: string;
    created_at?: string;
    updated_at?: string;
}

export interface Board{
    id: string;
    name: string;
    owner_id: string;
    created_at?: string;
    updated_at?: string;
}          

export interface Task {
    id: string; 
    board_id: string;
    name: string;
    completed: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface Permission {
    user_id: string;
    board_id: string;
    role: 'owner' | 'editor' | 'viewer';
}

export interface CreateTaskRequest {
  board_id: string;
  name: string;
}