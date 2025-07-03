// src/utils/boardValidation.ts

/**
 * Utilidades para validación y generación de nombres de tableros
 */

/**
 * Valida el nombre de un tablero
 */
export function validateBoardName(name: string): {
  isValid: boolean;
  error?: string;
} {
  const trimmed = name.trim();
  
  if (trimmed.length === 0) {
    return {
      isValid: false,
      error: "El nombre del tablero no puede estar vacío"
    };
  }
  
  if (trimmed.length > 100) {
    return {
      isValid: false,
      error: "El nombre del tablero no puede exceder 100 caracteres"
    };
  }
  
  // Verificar caracteres no permitidos (ejemplo: caracteres especiales para URLs)
  const invalidChars = /[<>:"/\\|?*]/;
  if (invalidChars.test(trimmed)) {
    return {
      isValid: false,
      error: "El nombre del tablero contiene caracteres no permitidos"
    };
  }
  
  return { isValid: true };
}

/**
 * Sanitiza el nombre de un tablero
 */
export function sanitizeBoardName(name: string): string {
  return name.trim();
}

/**
 * Genera un nombre único para un nuevo tablero
 */
export function generateUniqueBoardName(
  existingNames: string[], 
  baseName: string = "Tablero"
): string {
  let counter = 1;
  let proposedName = `${baseName} ${counter}`;
  
  // Buscar el próximo número disponible
  while (existingNames.includes(proposedName)) {
    counter++;
    proposedName = `${baseName} ${counter}`;
  }
  
  return proposedName;
}

/**
 * Verifica si un nombre de tablero ya existe
 */
export function isBoardNameTaken(name: string, existingNames: string[]): boolean {
  const trimmedName = name.trim();
  return existingNames.some(existing => 
    existing.trim().toLowerCase() === trimmedName.toLowerCase()
  );
}

/**
 * Sugiere nombres alternativos si el nombre ya existe
 */
export function suggestAlternativeNames(
  proposedName: string, 
  existingNames: string[]
): string[] {
  const suggestions: string[] = [];
  const baseName = proposedName.trim();
  
  // Agregar números
  for (let i = 1; i <= 5; i++) {
    const suggestion = `${baseName} ${i}`;
    if (!existingNames.includes(suggestion)) {
      suggestions.push(suggestion);
    }
  }
  
  // Agregar sufijos comunes
  const suffixes = ["Nuevo", "V2", "Copia", "Alt", "Bis"];
  for (const suffix of suffixes) {
    const suggestion = `${baseName} ${suffix}`;
    if (!existingNames.includes(suggestion)) {
      suggestions.push(suggestion);
    }
  }
  
  return suggestions.slice(0, 3); // Devolver máximo 3 sugerencias
}
