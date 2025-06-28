export function validateBoardName(name: string): string | null {
  if (!name.trim()) return "El nombre del tablero es requerido";
  if (name.length > 50) return "El nombre es muy largo";
  return null;
}

export function validateTaskContent(content: string): string | null {
  if (!content.trim()) return "El contenido de la tarea es requerido";
  if (content.length > 200) return "El contenido es muy largo";
  return null;
}