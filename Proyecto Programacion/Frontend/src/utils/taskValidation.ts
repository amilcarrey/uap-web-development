// src/utils/taskValidation.ts

/**
 * Utilidades para validación de tareas
 */

/**
 * Valida el contenido de una tarea
 */
export function validateTaskContent(content: string): {
  isValid: boolean;
  error?: string;
} {
  const trimmed = content.trim();
  
  if (trimmed.length === 0) {
    return {
      isValid: false,
      error: "El contenido de la tarea no puede estar vacío"
    };
  }
  
  if (trimmed.length > 500) {
    return {
      isValid: false,
      error: "El contenido de la tarea no puede exceder 500 caracteres"
    };
  }
  
  return { isValid: true };
}

/**
 * Sanitiza el contenido de una tarea
 */
export function sanitizeTaskContent(content: string): string {
  return content.trim();
}

/**
 * Valida y parsea un ID de tablero
 */
export function parseAndValidateBoardId(tabId: string): {
  isValid: boolean;
  boardId?: number;
  error?: string;
} {
  const boardId = parseInt(tabId, 10);
  
  if (isNaN(boardId)) {
    return {
      isValid: false,
      error: "ID de tablero inválido"
    };
  }
  
  if (boardId <= 0) {
    return {
      isValid: false,
      error: "ID de tablero debe ser mayor que 0"
    };
  }
  
  return {
    isValid: true,
    boardId
  };
}
