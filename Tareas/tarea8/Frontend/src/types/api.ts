// Respuestas genéricas de la API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  error: string;
  details?: Array<{
    code: string;
    expected: string;
    received: string;
    path: string[];
    message: string;
  }>;
  statusCode?: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Para validaciones
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationResponse {
  isValid: boolean;
  errors: ValidationError[];
}