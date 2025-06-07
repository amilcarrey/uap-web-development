export interface TaskDTO{
    content: string; // Contenido de la tarea
    active: boolean; // Estado activo de la tarea, por defecto tiene que ser false porque no se completo
    boardId: number; // ID del tablero al que pertenece la tarea
}