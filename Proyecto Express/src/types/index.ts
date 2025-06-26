export interface Board {
    id: string;
    name: string;
    created_at: string;
}

export interface Task {
    id: string;
    text: string;
    done: boolean;
    activeBoardId: string;
    created_at: string;
    updated_at: string
}

export interface CreateBoardRequest {
    id?: string;
    name: string;
}

export interface CreateTaskRequest {
    text: string;
    activeBoardId: string;
}

export interface User {
    id: string;
    email: string;
    password: string;
}