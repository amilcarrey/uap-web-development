export interface CreateUserRequest {
  nombre: string;
  email: string;
  password: string;
  role?: string;
}

export interface LoginRequest {
  nombre: string;
  password: string;
}