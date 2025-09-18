export function validateBoardName(name: string): string | null {
  if (!name.trim()) return "Nombre el tablero";
  if (name.length > 50) return "El nombre es muy largo";
  return null;
}

export function validateTaskContent(content: string): string | null {
  if (!content.trim()) return "Nombre la tarea";
  if (content.length > 200) return "Contenido muy largo";
  return null;
}