export interface UpdateTaskDTO {
    content?: string; // Contenido de la tarea, opcional para actualizar solo si se proporciona
    active?: boolean; // Estado activo de la tarea, opcional para actualizar solo si se proporciona
}